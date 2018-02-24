angular.module('CartCtrl', [])
    .controller('CartController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$mdToast', 'sessionService', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $mdToast, sessionService) {

        //retrieve transaction reference object to store transaction
        var transactRef = firebase.database().ref().child('Cart');
        $scope.checkoutItem = $firebaseObject(transactRef);

        var checkoutItem = $firebaseArray(transactRef);
        console.log("checkoutitem is ", checkoutItem);

        //method to assign total price to the cart
        checkoutItem.$loaded().then(function (menu) {
            //to bind the food menu dynamically
            //must first check for keys, then bind it to the array
            // console.log("menu: ", menu);
            var totalPrice = 0;
            for (var i in menu) {
                if (menu[i]['qty'] != undefined && menu[i]['price'] != undefined) {
                    totalPrice += (menu[i]['qty'] * menu[i]['price'])
                }

            }
            console.log("total price is: ", totalPrice);
            $scope.totalPrice = totalPrice;
        })

    }]);