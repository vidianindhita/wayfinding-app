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

'use strict';
var watchID;
var geoLoc;
var curLat;
var curLng;
var count = 1;

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is Nordic's UART service
var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.bindEvents();
        detailPage.hidden = true;
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        sendButton.addEventListener('click', this.sendData, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        app.refreshDeviceList();
        document.getElementById("getPosition").addEventListener("click", getPosition);
        document.getElementById("watchPosition").addEventListener("click", watchPosition);
    },

    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        ble.scan([bluefruit.serviceUUID], 5, app.onDiscoverDevice, app.onError);
        
        // if Android can't find your device try scanning for all devices
        // ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                app.determineWriteType(peripheral);

                // subscribe for incoming data
                ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
                app.showDetailPage();
            };

        ble.connect(deviceId, onConnect, app.onError);
    },
    determineWriteType: function(peripheral) {
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic

        var characteristic = peripheral.characteristics.filter(function(element) {
            if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
                return element;
            }
        })[0];

        if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
            app.writeWithoutResponse = true;
        } else {
            app.writeWithoutResponse = false;
        }

    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to the bluefruit le");
        };

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                data, success, failure
            );
        } else {
            ble.write(
                deviceId,
                bluefruit.serviceUUID,
                bluefruit.txCharacteristic,
                data, success, failure
            );
        }

    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
    }

};

app.initialize();

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
        //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
        console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
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