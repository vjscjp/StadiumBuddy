/*
 * cmxmap.js - manage a user map
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var user
var scale
var mapName
var imageName
var userListButton = "<button onClick='returnToUserList()'>Show List of All Users</button>"
var allUserMapButton = "<button onClick='showUserMap()'>Show Map of All Users</button>"
var currUser = null
var currUserHistory = null
var historyLengthToShow = 10
var historyMinimumGapSeconds = 60
var mapUpdateActive = false
var resizeEventHandlerSet = false
var lastAction = ""
var seatCoords = [0,0]
var positionHelper = false // Set true to activate click to show coordinates

// showUserMap - show the map of users
// Arguments:
//   mapNameArg   - human-readable name of map for header
//   imageNameArg - filename of image to show
//   userToShow   - index of user for which history is desired; -1 to show all users
function showUserMap(mapNameArg, imageNameArg, userToShow, userHistory) {
  mapUpdateActive = true
  currUser = userToShow
  if (typeof mapNameArg == "string") {
    mapName = mapNameArg
  }
  if (typeof imageNameArg == "string") {
    imageName = imageNameArg
  }
  $("#content").show()
  var userlist = global.userlist
  var map = jQuery('#map');
  var imgUrl = "img/" + imageName
  var imgWidth = $(window).width() * 0.9
  scale = imgWidth / userlist[0].mapInfo.floorDimension.width;
  var w = imgWidth
  var h = Math.round(userlist[0].mapInfo.floorDimension.length * scale)
  map.css({width: w + 'px', height:h+'px', backgroundImage:'url('+imgUrl+')', backgroundSize:w+'px '+ h+'px' });
  map.show()
  setResizeEventHandler(true)
  if (typeof userToShow == "number" && userToShow >= 0) {
    if (typeof userHistory == "object") {
      showUserHistory(userHistory)
    } else {
      getUserHistory(userToShow)
    }
  } else {
    // Add links for individual users
    $("#heading").html(mapName)
    for (var i = 0; i < userlist.length; i++) {
        var user = userlist[i]
        seatCoords[0] = user.mapCoordinate.x * scale
        seatCoords[1] = user.mapCoordinate.y * scale
        map.append( $("<a />", {
              href: "#",
              id: "seat" + i,
              class:"point",
              onclick: "showContextMenu(event)"
          }).css({left: seatCoords[0] + 'px', top:seatCoords[1] + 'px'}))
        map.append($("<a />", {
              href: "#",
              id: "seatCaption" + i,
              text: "Your Location.",
              class:"pointCaption",
              onclick: "showContextMenu(event)"
          }).css({left: (seatCoords[0]+18) + 'px', top:seatCoords[1] + 'px', zIndex: -1}))
        $("#seat" + i).bind("contextmenu", showContextMenu);
        $("#seatCaption" + i).bind("contextmenu", showContextMenu);
    }
    $(".userPoint").remove()
    $(".userPointCaption").remove()
    $(".userPointIcon").remove()
    $(".lineClass").remove()
    mapUpdateActive = false
    if (positionHelper) {
        $("#positionHelper").show()
        $("#map").click(function(e) {
            var posX = (e.pageX - $(this).offset().left) / scale - 10;
            var posY = (e.pageY - $(this).offset().top) / scale - 10;
            $("#positionHelperXvalue").html(posX);
            $("#positionHelperYvalue").html(posY);
            var info = "left(" + $(this).offset().left + ") top(" + $(this).offset().top + ")\n" +
                      "e.pageX(" + e.pageX + ") e.pageY(" + e.pageY + ")\n" +
                      "scale(" + scale + ") imgWidth(" + imgWidth + ")";
            var zz = 0
        });
    }
  }
}

function showContextMenu(event) {
    event.preventDefault();
    $(".custom-menu").finish().toggle(100).
    css({
        top: event.pageY + "px",
        left: event.pageX + 3 + "px"
    })
}

function doMenuSelection(action) {
    var places
    switch(action) {
        case "Gate": places = gates; break;
        case "Food Service": places = foodservice; break;
        case "Restroom": places = restrooms; break;
        case "reset": places = []; break;
    }
    $(".userPoint").remove()
    $(".userPointCaption").remove()
    $(".userPointIcon").remove()
    $(".lineClass").remove()
    var map = jQuery('#map');
    var colors = ["green", "yellow", "red"]
      var styles = ["qtip-green", "qtip-default", "qtip-red"]
    for (var i = 0; i < places.length; i++) {
        var place = places[i]
        var x = place.x * scale
        var y = place.y * scale
        var tooltip = '<div class="' + styles[place.crowd] +'"" style="display:none" >' +
                      '<h2>' + place.name + '</h2>' +
                      '<h3><b>Current Wait:</b> ' + place.wait + ' mins</h3>' +
                      '<img class="centerImg" src="img/' + place.img + '" />' +
                      '</div>';
        map.append( $("<a />", {
              href: "#",
              class:"userPoint",
              onclick:"drawPath(" + place.path + "," + x + "," + y + ")"
          }).css({top:y + 'px', left: x + 'px', "backgroundColor": colors[place.crowd]}))
        var iconXposn = x + 10
        if (place.icon.substring(0,4) == "mens") {
            iconXposn -= 30
        }
        map.append(tooltip)
        map.append($("<img />", {
              src: "img/" + place.icon,
              class:"userPointIcon",
              width: "32px",
              onclick:"drawPath(" + place.path + "," + x + "," + y + ")"
          }).css({top:(y+10) + 'px', left:iconXposn + 'px', cursor: "pointer"}))
        map.append(tooltip)
    }
    lastAction = action

    // Tooltip for services
    $('.userPoint').each(function() { // Notice the .each() loop, discussed below
        $(this).qtip({
            content: {
                text: $(this).next('div') // Use the "div" element next to this for the content
            },
            style: 'qtip-bootstrap',
            position: {
              my: 'top center',
              at: 'bottom center'
            }
        });
    });
    $('.userPointIcon').each(function() { // Notice the .each() loop, discussed below
        $(this).qtip({
            content: {
                text: $(this).next('div') // Use the "div" element next to this for the content
            },
            style: 'qtip-bootstrap',
            position: {
              my: 'top center',
              at: 'bottom center'
            }
        });
    });

    if (lastAction != "reset") {
        var content = jQuery('#content');
        var imgWidth = map.offset().left
        var legend = '<h2 class="userPointCaption userPointCaptionHeader" style="left:' + imgWidth + 'px">' + action + " Crowds</h2>" +
                     '<br><span class="userPoint userPointLegend" style="left:' + imgWidth + 'px; background-color: lime">Low</span>' +
                     '<br><span class="userPoint userPointLegend" style="left:' + imgWidth + 'px; background-color: yellow">Medium</span>' +
                     '<br><span class="userPoint userPointLegend" style="left:' + imgWidth + 'px; background-color: red">Heavy</span>';
        content.html(legend)
    }
}

// Draw a path from the user's seat location to the point
function drawPath(path, pointX, pointY) {
    $(".lineClass").remove()
    var x = seatCoords[0] + 5
    var y = seatCoords[1] + 5
    path.forEach(function(point) {
      $("#map").line(x, y, point[0]*scale, point[1]*scale, {style:"dashed", stroke:2})
      x = point[0]*scale
      y = point[1]*scale
    })
    $("#map").line(x, y, pointX+7.5, pointY+7.5, {style:"dashed", stroke:2})
}

function getUserHistory(i)
{
  mapUpdateActive = true
  currUser = i
  $(".point").remove()
  $(".pointCaption").remove()
  $(".userPoint").remove()
  $(".userPointCaption").remove()  
  $(".userPointIcon").remove()
  $(".lineClass").remove()
  $("#content").html(userListButton + "&nbsp;&nbsp" + allUserMapButton)
  $("#content").append("<br><br><span class='mapCaption'>Points are numbered from the most recent; hover over a point to see its exact time</span>")
  var user = global.userlist[i]
  if (user.userName == user.macAddress) {
    $("#heading").html("Location History of user at MAC Address " + user.macAddress)
  } else {
    $("#heading").html("Location History of User " + user.userName + " at MAC Address " + user.macAddress)
  }
  $.get(
      cmxUrl("/location/v1/history/clients/" + user.macAddress),
      showUserHistory,
      "json")
   .fail(showMapRestError)
}

function showUserHistory(history) {
  mapUpdateActive = true
  currUserHistory = history
  var map = jQuery('#map');
  var timeOfLastPoint = 0
  var minGapMS = historyMinimumGapSeconds*1000
  var pointsShown = 0
  for (var i = 0; pointsShown < historyLengthToShow && i < history.length; i++) {
    var timestamp = history[i].sourceTimestamp
    if (timestamp - timeOfLastPoint >= minGapMS) {
      var x = history[i].mapCoordinate.x * scale
      var y = history[i].mapCoordinate.y * scale
      timestamp = new Date(timestamp*1000)
      map.append( $("<a />", {
            href: "#",
            title: timestamp,
            text: ++pointsShown,
            class:"userPoint"
        }).css({top:y + 'px', left: x+ 'px'}))
      map.append($("<span />", {
            text: timestamp.toLocaleTimeString(),
            class:"userPointCaption"
        }).css({top:y + 'px', left: (x+18) + 'px'}))
    }
  }
  mapUpdateActive = false
}

function returnToUserList() {
  $("#map").hide()
  $("#content").hide()
  setError()
  setResizeEventHandler(false)
  getUsers()
}

function showMapRestError(jqXHR, textStatus, errorThrown) {
  setResizeEventHandler(false)
  showRestError(jqXHR, textStatus, errorThrown)
}

// Handle resize events by redrawing the map
function setResizeEventHandler(setEventHandler) {
  if (resizeEventHandlerSet && !setEventHandler) {
    resizeEventHandlerSet = false
    $(window).off("resize")
    mapUpdateActive = false
  }
  else if (setEventHandler && !resizeEventHandlerSet) {
    resizeEventHandlerSet = true
    $(window).resize(function() {
      if (resizeEventHandlerSet && !mapUpdateActive) {
        $(".point").remove()
        $(".pointCaption").remove()
        $(".userPoint").remove()
        $(".userPointCaption").remove()
        $(".userPointIcon").remove()
        $(".lineClass").remove()
        showUserMap(0, 0, currUser, currUserHistory)
        if (lastAction.length > 0) {
            doMenuSelection(lastAction)
        }
      }
    })
  }
}
