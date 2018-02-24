angular.module('RaidParticipationCtrl', [])
    .controller('RaidParticipationController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', 'selectedItem', '$http', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService, selectedItem, $http) {
    
    // $scope.raid = {
    //     id: 1,
    //     curMemberCount: 3,
    //     maxMemberCount: 20,
    //     maxDiscountRate: 20,
    //     item: {
    //         originalPrice: 30,
    //         itemName: 'Watch'
    //     }
    // };

    $scope.width = "width: " + (3/20 * 100) + "%";

}])
