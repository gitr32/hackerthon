angular.module('ShippingCtrl', [])
    .controller('ShippingController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', 'selectedItem', '$http', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService, selectedItem, $http) {

    $scope.selectedItem = selectedItem.getSelectedItem();
    $scope.response = '';
    var options = { method: 'POST',
    url: 'https://api.easyship.com/rate/v1/rates',
    headers:
    {
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer sand_cSao/FwYNZ+Tyvyb/pENjoC1vw7TT91Nra4daTDNPOs=',
        'Content-Type': 'application/json',
        'Accept': 'application/json' },
        data:
        { origin_country_alpha2: 'US',
        origin_postal_code: '45373',
        origin_state: 'OH',
        destination_country_alpha2: 'SG',
        destination_postal_code: '45373',
        taxes_duties_paid_by: 'Receiver',
        is_insured: true,
        items:
        [ { actual_weight: 10,
        height: 1,
        width: 1,
        length: 1,
        category: 'documents',
        declared_currency: 'USD',
        declared_customs_value: 36.79 } ] },
        json: true };

        $http(options)
        .then(function successCallback(response) {
            $scope.response = response;
            console.log("response isss: ", response);
        }, function errorCallback(response) {
            console.log(response);
        });

    function calculateRates(item){


    }

}])
