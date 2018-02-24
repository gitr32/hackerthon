angular.module('RaidParticipationCtrl', [])
    .controller('RaidParticipationController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', 'selectedItem', '$http', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService, selectedItem, $http) {

    var transactRef = firebase.database().ref().child('Cart');
    $scope.checkoutItem = $firebaseObject(transactRef);

    var checkoutItem = $firebaseArray(transactRef);
    console.log("checkoutitem is ", checkoutItem);

    var raidRef = firebase.database().ref().child('Raid').child('1111');
    $scope.raid = $firebaseObject(raidRef);

    var price = 0;

    $scope.raidCompleted = function() {
        console.log('raid completed');
        if ($scope.currentMemberCount == $scope.maxMemberCount) {
            return true;
        }
        return false;
    }
    $scope.redirect = function() {
        $location.path('/raidEvaluation');
    }

    //method to assign total price to the cart
    checkoutItem.$loaded().then(function (menu) {
        //to bind the food menu dynamically
        //must first check for keys, then bind it to the array
        // console.log("menu: ", menu);
        
        var totalPrice = 0;
        for (var i in menu) {
            if (menu[i]['qty'] != undefined && menu[i]['price'] != undefined) {
                totalPrice += (menu[i]['qty'] * menu[i]['price'])
                $scope.imageURL = menu[i].imageUrl;
                $scope.itemName = menu[i].name;
                $scope.itemCategory = menu[i].category.toUpperCase();
            }
            
        }

        $scope.price = totalPrice;

        $scope.individualDiscount = 0.1 * totalPrice;
        
        price = totalPrice;
        
        $scope.shippingCost = 130.3;
    
        $scope.raid.$loaded().then(function (response) {
            const currentMemberCount = response.currentMemberCount;
            const maxMemberCount = response.maxMemberCount;
            const maxDiscount = response.maxDiscount;

            $scope.groupDiscountPercentage = currentMemberCount/maxMemberCount * maxDiscount + "%";
            $scope.groupDiscount = currentMemberCount/maxMemberCount * maxDiscount/100 * price;
            
            $scope.currentMemberCount = currentMemberCount;
            $scope.maxMemberCount = maxMemberCount; 

            $scope.width = "width: " + (currentMemberCount/maxMemberCount*100) + "%";
            $scope.max = maxDiscount;

            $scope.totalCost = (totalPrice - $scope.individualDiscount - $scope.groupDiscount - $scope.shippingCost).toFixed(2);
        })
    })
}])
