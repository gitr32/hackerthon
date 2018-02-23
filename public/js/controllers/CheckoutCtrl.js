angular.module('CheckoutCtrl', [])
    .controller('CheckoutController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$mdToast', 'sessionService', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $mdToast, sessionService) {
        //retrieve foodList and total price
        // var foodList = checkOutItems.getFoodList();
        // var totalPrice = checkOutItems.getTotalPrice();

        var foodList = JSON.parse(sessionService.get('foodList'));
        var totalPrice = sessionService.get('totalPrice');
        console.log("foodList: ", foodList);
        console.log("totalPrice: ", totalPrice);

        //retrieve transaction reference object to store transaction
        var transactRef = firebase.database().ref().child('Transaction');
        var transactRefObj = $firebaseArray(transactRef);

        //retrieve cash and ezlink payment option from firebase to be populated
        var paymentRef = firebase.database().ref().child('Payment');

        $scope.paymentArr = $firebaseObject(paymentRef);

        //user selects the payment type
        $scope.selectPayment = function (paymentType) {

            if (paymentType === "Ezlink") {
                $location.path('/confirm');

            } else {
                $mdDialog.show({

                    templateUrl: 'views/quantity.html',
                    controller: processPayment,
                    clickOutsideToClose: false,
                    fullScreen: true,
                    locals: {
                        totalPrice: totalPrice,
                        foodList: foodList
                    }
                })
                function processPayment($scope, $mdDialog, totalPrice, foodList) {
                    $scope.paidAmount = 0;
                    $scope.changeAmount = 0 - totalPrice;
                    $scope.totalPrice = totalPrice;
                    $scope.calculateChange = function (totalPrice, paidAmount) {
                        $scope.changeAmount = (totalPrice - paidAmount) * -1;
                    }
                    $scope.cancelPayment = function () {
                        $mdDialog.hide();
                    }

                    $scope.confirmPayment = function () {
                        //format date object
                        var date = new Date();
                        var dateStr = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                        //store in json object
                        var transactionObj = {
                            [dateStr]: {
                                cart: foodList,
                                total: totalPrice,
                                payment_type: 'Cash'
                            }
                        }
                        //add into firebase
                        transactRefObj.$add(transactionObj).then(function (ref) {
                            $mdDialog.hide();
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('Transaction completed!')
                                    .position('bottom right left')
                                    .hideDelay(3000)
                                    .toastClass('md-toast-done')
                            );
                            sessionService.unset('foodList');
                            sessionService.unset('checkBox');
                            sessionService.unset('totalPrice');
                            $location.path('/');
                        });

                    }

                }

            }

        }
    }]);