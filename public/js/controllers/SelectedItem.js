angular.module('SelectedItemCtrl', [])
    .controller('SelectedItemController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', 'selectedItem', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService, selectedItem) {

        var selectedItem = selectedItem.getSelectedItem();
        console.log("selectedItem is: ", selectedItem);
        $scope.selectedItem = selectedItem;






    }])
