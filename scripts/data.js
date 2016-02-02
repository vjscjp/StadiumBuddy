/*
 * Specify location and dimensions of map and points of interest
 *
 * This file is part of the Cisco Shipped CMX demo application.
 * Copyright (C) 2015 Cisco.  All rights reserved.
 */

var userlist = $.parseJSON(
    '[{"mapCoordinate": {"unit": "FEET","x": 393.0,"y": 260.0,"z": 0.0},"mapInfo": {"floorDimension": {"height": 16.5,"length": 926.0,"offsetX": 0.0,"offsetY": 0.0,"unit": "FEET","width": 915.0},"floorRefId": "723413320329068590","image": {"colorDepth": 0,"height": 0.0,"imageName": "metropolisStadium.png","maxResolution": 0.0,"size": 0.0,"sourceFile": null,"width": 0.0,"zoomLevel": 0},"mapHierarchyString": "Metropolis Stadium","tagList": []},"userName": "David"}]'
)

 
var foodservice = [
   {"x": 235, "y": 215, "crowd": 0, "wait": 5, "name": "12 Grill", "img": "12-grill.png", "path":"[[387,265],[386,249],[250,264]]", "icon":"12-grill-icon.png"},
   {"x": 360, "y": 292, "crowd": 2, "wait": 15, "name": "Best of Pioneer Square", "img": "best-of-pioneer-square.png", "path":"[[387,265],[387,297]]", "icon":"best-of-pioneer-square-icon.png"},
   {"x": 283, "y": 295, "crowd": 1, "wait": 10, "name": "Papa John's Pizza", "img":"papa-johns.png", "path":"[[387,265],[386,249],[306,258],[312,300]]", "icon":"papa-johns-icon.png"},
   {"x": 398, "y": 200, "crowd": 1, "wait": 9, "name": "360 Sizzle", "img":"360-sizzle.png", "path":"[[387,265],[386,249],[407,247]]", "icon":"360-sizzle-icon.png"},
   {"x": 481, "y": 200, "crowd": 1, "wait": 11, "name": "Ciao Down!", "img":"ciao-down.png", "path":"[[387,265],[386,249],[487,246]]", "icon":"ciao-down-icon.png"},
]

var gates = [{"x": 135, "y": 275, "crowd": 0, "wait": 0, "name": "NE Gate", "img": "gate.png", "path":"[[387,265],[380,172],[247,186],[190,197]]", "icon":"gate-icon.png"}]

var restrooms = [
   {"x": 330, "y": 255, "crowd": 1, "wait": 3, "name": "Men's Restroom", "img":"mens-room.png", "path":"[[387,265],[386,249],[340,252]]", "icon":"mens-room-icon.png"},
   {"x": 349, "y": 255, "crowd": 2, "wait": 8, "name": "Women's Restroom", "img":"womens-room.png", "path":"[[387,265],[386,249],[354,251]]", "icon":"womens-room-icon.png"},
   {"x": 532, "y": 255, "crowd": 0, "wait": 1, "name": "Men's Restroom", "img":"mens-room.png", "path":"[[387,265],[386,249],[543,251]]", "icon":"mens-room-icon.png"},
   {"x": 554, "y": 256, "crowd": 1, "wait": 3, "name": "Women's Restroom", "img":"womens-room.png", "path":"[[387,265],[386,249],[561,251]]", "icon":"womens-room-icon.png"}
]
