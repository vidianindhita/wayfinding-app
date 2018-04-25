/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var watchID;
var geoLoc;
var curLat;
var curLng;
var count = 1;

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     console.log("navigator.geolocation works well");
//     document.getElementById("getPosition").addEventListener("click", getPosition);
//     document.getElementById("watchPosition").addEventListener("click", watchPosition);  
// }

// function getPosition() {
//    var options = {
//       enableHighAccuracy: true,
//       maximumAge: 3600000
//    }
//    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

//    function onSuccess(position) {
//       alert('Latitude: '          + position.coords.latitude          + '\n' +
//          'Longitude: '         + position.coords.longitude         + '\n' +
//          'Altitude: '          + position.coords.altitude          + '\n' +
//          'Accuracy: '          + position.coords.accuracy          + '\n' +
//          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//          'Heading: '           + position.coords.heading           + '\n' +
//          'Speed: '             + position.coords.speed             + '\n' +
//          'Timestamp: '         + position.timestamp                + '\n');
//    };

//    function onError(error) {
//       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
//    }
// }

// function watchPosition() {
//    var options = {
//       maximumAge: 3600000,
//       timeout: 3000,
//       enableHighAccuracy: true,
//    }
//    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

//    function onSuccess(position) {
//       alert('Latitude: '          + position.coords.latitude          + '\n' +
//          'Longitude: '         + position.coords.longitude         + '\n' +
//          'Altitude: '          + position.coords.altitude          + '\n' +
//          'Accuracy: '          + position.coords.accuracy          + '\n' +
//          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//          'Heading: '           + position.coords.heading           + '\n' +
//          'Speed: '             + position.coords.speed             + '\n' +
//          'Timestamp: '         + position.timestamp                + '\n');
//    };

//    function onError(error) {
//       alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
//    }
// }

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
// var onSuccess = function(position) {
//     alert('Latitude: '          + position.coords.latitude          + '\n' +
//           'Longitude: '         + position.coords.longitude         + '\n' +
//           'Altitude: '          + position.coords.altitude          + '\n' +
//           'Accuracy: '          + position.coords.accuracy          + '\n' +
//           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//           'Heading: '           + position.coords.heading           + '\n' +
//           'Speed: '             + position.coords.speed             + '\n' +
//           'Timestamp: '         + position.timestamp                + '\n');
// };

// // onError Callback receives a PositionError object
// //
// function onError(error) {
//     alert('code: '    + error.code    + '\n' +
//           'message: ' + error.message + '\n');
// }

// navigator.geolocation.getCurrentPosition(onSuccess, onError);

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.getElementById("getPosition").addEventListener("click", getPosition);
        document.getElementById("watchPosition").addEventListener("click", watchPosition);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

    // getPosition: function() {
    //     var options = {
    //       enableHighAccuracy: true,
    //       maximumAge: 3600000
    //     }
    //     var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    //     function onSuccess(position) {
    //       alert('Latitude: '          + position.coords.latitude          + '\n' +
    //          'Longitude: '         + position.coords.longitude         + '\n' +
    //          'Altitude: '          + position.coords.altitude          + '\n' +
    //          'Accuracy: '          + position.coords.accuracy          + '\n' +
    //          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //          'Heading: '           + position.coords.heading           + '\n' +
    //          'Speed: '             + position.coords.speed             + '\n' +
    //          'Timestamp: '         + position.timestamp                + '\n');
    //     };

    //     function onError(error) {
    //       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    //     }
    // },

    // watchPosition: function() {
    //     var options = {
    //       maximumAge: 3600000,
    //       timeout: 3000,
    //       enableHighAccuracy: true,
    //    }
    //    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

    //    function onSuccess(position) {
    //       alert('Latitude: '          + position.coords.latitude          + '\n' +
    //          'Longitude: '         + position.coords.longitude         + '\n' +
    //          'Altitude: '          + position.coords.altitude          + '\n' +
    //          'Accuracy: '          + position.coords.accuracy          + '\n' +
    //          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //          'Heading: '           + position.coords.heading           + '\n' +
    //          'Speed: '             + position.coords.speed             + '\n' +
    //          'Timestamp: '         + position.timestamp                + '\n');
    //    };

    //    function onError(error) {
    //       alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    //    }
    // }

};

app.initialize();

// function showLocation(position) {
//     curLat = position.coords.latitude;
//     curLng = position.coords.longitude;
//     //alert("Latitude : " + latitude + " Longitude: " + longitude);
//     console.log("Latitude : " + curLat + " Longitude: " + curLng);
//     var stepdata = json.routes[0].legs[0].steps;

//     for (var i=0; i<stepdata.length; i++){
//         var poly = stepdata[i].maneuver.polygon;

//         var points = turf.points([
//             [curLng, curLat]
//             ]);

//         var searchWithin = turf.polygon([poly]);
//         var pointWithin = turf.pointsWithinPolygon(points, searchWithin);
//         if (pointWithin){
//             console.log(stepdata[i].maneuver.instruction);
//             document.getElementById("result").innerHTML = stepdata[i].maneuver.instruction;
//             break;
//         }
//     }
// }

// function errorHandler(err) {
//     if(err.code == 1) {
//         alert("Error: Access is denied!");
//     }

//     else if( err.code == 2) {
//         alert("Error: Position is unavailable!");
//     }
// }

// function getLocationUpdate(){
//     document.getElementById("clicked").innerHTML = "CLICKED";
//     if(navigator.geolocation){
//        // timeout at 60000 milliseconds (60 seconds)
//         var options = {timeout:60000};
//         geoLoc = navigator.geolocation;
//         console.log("GeoLoc : " + geoLoc);
//         watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
//         console.log("WatchID : " + watchID);    }

//     else{
//         alert("Sorry, browser does not support geolocation!");
//     }
// }

function getPosition() {
    
    var options = {
        enableHighAccuracy: true,
        maximumAge: 3000
    }
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    document.getElementById("clicked-location").innerHTML = "CLICKED LOCATION";

    function onSuccess(position) {
        curLat = position.coords.latitude;
        curLng = position.coords.longitude;
      // alert('Latitude: '          + position.coords.latitude          + '\n' +
      //    'Longitude: '         + position.coords.longitude         + '\n' +
      //    'Altitude: '          + position.coords.altitude          + '\n' +
      //    'Accuracy: '          + position.coords.accuracy          + '\n' +
      //    'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //    'Heading: '           + position.coords.heading           + '\n' +
      //    'Speed: '             + position.coords.speed             + '\n' +
      //    'Timestamp: '         + position.timestamp                + '\n');
      console.log('Latitude: '+ curLat + 'Longitude: ' + curLng + '\n');
      document.getElementById("show-location").innerHTML = 'Latitude: ' + curLat + '\n' +   'Longitude: ' + curLng;
    };

   function onError(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
      document.getElementById("show-location").innerHTML = "NOT SHOWING LOCATION";
   }
}

function watchPosition() {
        var options = {
        maximumAge: 300000,
        timeout: 5000,
        enableHighAccuracy: true,
    }
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    document.getElementById("clicked-update").innerHTML = "CLICKED UPDATE";

    function onSuccess(position) {
        curLat = position.coords.latitude;
        curLng = position.coords.longitude;

      // alert('Latitude: '          + position.coords.latitude          + '\n' +
      //    'Longitude: '         + position.coords.longitude         + '\n' +
      //    'Altitude: '          + position.coords.altitude          + '\n' +
      //    'Accuracy: '          + position.coords.accuracy          + '\n' +
      //    'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //    'Heading: '           + position.coords.heading           + '\n' +
      //    'Speed: '             + position.coords.speed             + '\n' +
      //    'Timestamp: '         + position.timestamp                + '\n');
        
        console.log('Latitude: '+ curLat + 'Longitude: ' + curLng + '\n');
        document.getElementById("show-location-update").innerHTML = 'Latitude: ' + curLat + '\n' +   'Longitude: ' + curLng;
        var stepdata = json.routes[0].legs[0].steps;

        for (var i=0; i<stepdata.length; i++){
        var poly = stepdata[i].maneuver.polygon;

        var points = turf.points([
            [curLng, curLat]
            ]);

        var searchWithin = turf.polygon([poly]);
        var pointWithin = turf.pointsWithinPolygon(points, searchWithin);
        if (pointWithin){
            console.log(stepdata[i].maneuver.instruction);
            document.getElementById("show-location-update").innerHTML = 'Latitude: ' + curLat + '\n' +   'Longitude: ' + curLng;
            document.getElementById("show-instruction").innerHTML = stepdata[i].maneuver.instruction;
            break;
        }
    }
    };

    function onError(error) {
        alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
        document.getElementById("show-location-update").innerHTML = "NOT SHOWING UPDATE";
        incrementError();
    }
}

function incrementError() {
    count++;
    if (count == 3) {
        watchPosition();
        count = 0;
    }
}