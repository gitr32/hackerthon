angular.module('appDirective', [])
    .factory('websocketService', function () {
        return {
            start: function (url, callback) {
                var websocket = new WebSocket(url);
                websocket.onopen = function () {
                };
                websocket.onmessage = function (evt) {
                    callback(evt);
                };
            }
        }
    });