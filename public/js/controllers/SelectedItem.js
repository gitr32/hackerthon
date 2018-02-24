angular.module('SelectedItemCtrl', [])
    .controller('SelectedItemController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', 'selectedItem', '$mdToast', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService, selectedItem, $mdToast) {

        var selectedItem = selectedItem.getSelectedItem();
        console.log("selectedItem is: ", selectedItem);
        $scope.selectedItem = selectedItem;
        $scope.dimensions = selectedItem.dimensions;
        console.log("dimensions is: ", $scope.dimensions);

        var cartref = firebase.database().ref().child('Cart');
        $scope.cartArr = $firebaseArray(cartref);

        $scope.processAddToCart = function (quantity, selectedItem) {

            var fashionRef = firebase.database().ref().child('Cart')
            $scope.cartArr.$add({
                category: "watches",
                imageUrl: selectedItem.imageUrl,
                name: selectedItem.name,
                price: selectedItem.price,
                dimensions: selectedItem.dimensions,
                qty: quantity,
                weight: selectedItem.weight
            }).then(function (ref) {
                console.log("data added!");
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Cart Added!')
                        .position('top right left')
                        .hideDelay(3000)
                        .toastClass('md-toast-done')
                );
                // sessionService.unset('foodList');
                // sessionService.unset('checkBox');
                // sessionService.unset('totalPrice');
                $location.path('/')
            })

        }

        // $scope.fashionItemsSizes = selectedItem.size


    }])
