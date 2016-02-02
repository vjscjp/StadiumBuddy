/*
 * login.js - manage the login form
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var restApiRoot = "/api"
var loginHeading = "Welcome to Stadium Buddy on <a href='http://ciscocloud.github.io/shipped/dist/#/'>Shipped</a>"

// Fetch initial configuration from server and adjust form

$(document).ready(function() {
    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {        
        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {            
            // Hide it
            $(".custom-menu").hide(100);
        }
    });

    // If the menu element is clicked
    $(".custom-menu li").click(function(){
        doMenuSelection($(this).attr("data-action"))
        $(".custom-menu").hide(100);
      });
    
    /*
    // Tooltip for services
    $('.userPoint').each(function() { // Notice the .each() loop, discussed below
        $(this).qtip({
            content: {
                text: $(this).next('div') // Use the "div" element next to this for the content
            }
        });
    });
    */
})

// validate - Validate user's login info
function validate()
{
    if(validateServer()) {
        global.username = $("#user").val()
        var password = $("#pass").val();
        doLogin(password)
    }
}

// validateServer - Verify CMX server specifies a URL of the form http[s]://xxx:nnn
function validateServer()
{
      return true
}

// doLogin - throw up the stadium map
function doLogin(password) {
    $("#loginForm").hide()
    $("#logo").hide()
    $("#heading").html('')
    $("#logoutButton").show()
    getUsers()
}

// doLogout - close map and return to login
function doLogout() {
  setError()
  global.mapDisplayedOnce = false
  $("#logo").show()
  $("#heading").html(loginHeading)
  $("#loginForm").show()
  $("#logoutButton").hide()
  $("#content").hide()
  $("#content").empty()
  $("#map").hide()
  $("#map").empty()
  $("#map").css({backgroundImage:"none"})
  setResizeEventHandler(false)
}

// setVirtualize - respond to setting of the virtualize checkbox
function setVirtualize() {
  $("#cmxServer").prop('disabled', true)
  $("#cmxServer").val(global.cmxServer)
  return true
}
