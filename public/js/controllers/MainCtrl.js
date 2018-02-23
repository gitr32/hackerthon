angular.module('MainCtrl', [])
    .controller('MainController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$websocket', '$q', 'websocketService', 'sessionService', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $websocket, $q, websocketService, sessionService) {


        var menuRef = firebase.database().ref().child('Menu');
        // $scope.menuArr = $firebaseArray(menuRef);
        $scope.menuArr = $firebaseObject(menuRef);
        // console.log("menuarr is: ", $scope.menuArr);
        var menuArrVar = $scope.menuArr;

        $scope.foodList = [];

        // if (JSON.parse(sessionService.get('foodList')) !== null) {
        //     $scope.foodList = JSON.parse(sessionService.get('foodList'));
        // }

        $scope.totalPrice = 0;

        $scope.checkBox = {}

        // if (JSON.parse(sessionService.get('checkBox')) !== null) {
        //     $scope.checkBox = JSON.parse(sessionService.get('checkBox'));
        // }

        menuArrVar.$loaded().then(function (menu) {
            //to bind the food menu dynamically
            //must first check for keys, then bind it to the array
            for (var key in menu) {
                if (key !== 'forEach' && key.substr(0, 1) !== '$') {
                    $scope.checkBox[key] = {
                        's': false,
                        'm': false,
                        'l': false
                    }
                }

            }
        })


        // $scope.checkBox = {
        //     "Char Kway Teow": {
        //         's': false,
        //         'm': false,
        //         'l': false
        //     },
        //     "Hokkien Mee": {
        //         's': false,
        //         'm': false,
        //         'l': false
        //     },
        //     "Oyster Omellette": {
        //         's': false,
        //         'm': false,
        //         'l': false
        //     },
        // }

        //for checking of foodList
        var temp = [];
        $scope.selectFood = function (ev, food, index, foodList, checkBox) {
            //set small size as default
            checkBox[food.name]['s'] = true;
            //selected food is small on default
            var foodSize = {
                s: {
                    amount: menuArrVar[food.name]['price']['s'],
                    qty: 1
                },
                m: {
                    amount: 0,
                    qty: 0
                },
                l: {
                    amount: 0,
                    qty: 0
                }
            }

            //add the selected food item into the list
            if (temp[food.name] === undefined) {
                var foodItem = [food.name, foodSize];

                foodList.push(foodItem);


                // calculate the price
                $scope.totalPrice = calculateTotalPrice(foodList);

                //this is to ensure that owner can only add an item ONCE
                temp[food.name] = ' ';


            }


        }

        $scope.calculateCheck = function (checkBox, foodItem, foodList, size) {


            if (checkBox[foodItem[0]][size]) {
                foodItem[1][size]['qty'] = 1;
            } else {
                foodItem[1][size]['qty'] = 0;
            }


            foodItem[1][size]['amount'] = calculatePrice(foodItem, size);
            $scope.totalPrice = calculateTotalPrice(foodList);
            // console.log("foodItem is: ", foodItem);
            // for(var i in foodList){
            //     if(foodList[i][0] === foodItem[0]){
            //         foodList[i] = foodItem;
            //     }
            // }
        }

        $scope.addQty = function (index, foodItem, foodList, size) {

            //retrieve quantity from array and add 1 to it
            var qty = foodItem[1][size]['qty'];
            qty++;
            //assign new qty back into the food array
            foodItem[1][size]['qty'] = qty;
            //recalculate the new price
            foodItem[1][size]['amount'] = calculatePrice(foodItem, size);
            $scope.totalPrice = calculateTotalPrice(foodList);

        }

        $scope.lessQty = function (index, foodItem, foodList, size) {

            //retrieve quantity from array and subtract 1 to it
            var qty = foodItem[1][size]['qty'];
            if (qty > 1) {
                qty--;
            }
            foodItem[1][size]['qty'] = qty;
            foodItem[1][size]['amount'] = calculatePrice(foodItem, size);
            $scope.totalPrice = calculateTotalPrice(foodList);

        }

        $scope.removeItem = function(foodItem, foodList, index){
            console.log("foodItem is: ", foodItem);
            console.log("foodList is: ", foodList);
            console.log("index is: ", index);
            var foodListCopy = foodList.slice();
            foodListCopy.reverse();
            foodListCopy = foodListCopy.splice(index,0);
            console.log("foodListCopy is: ", foodListCopy);
            foodList = foodListCopy;


        }

        // $scope.changeSize = function (foodItem, selectedSize, foodList) {
        //     //switch size
        //
        //     foodItem[1] = selectedSize;
        //
        //     //recalculate price
        //     foodItem[3] = calculatePrice(foodItem);
        //     $scope.totalPrice = calculateTotalPrice(foodList);
        //
        // }

        function calculatePrice(foodItem, size) {

            return foodItem[1][size]['qty'] * menuArrVar[foodItem[0]]['price'][size];
            // menuArrVar[food.name]['price']['s']]
        }

        function calculateTotalPrice(foodList) {
            var totalPrice = 0;

            for (var i in foodList) {
                totalPrice += foodList[i][1]['s']['amount'];
                totalPrice += foodList[i][1]['m']['amount'];
                totalPrice += foodList[i][1]['l']['amount'];
            }
            return totalPrice;
        }

        $scope.processCheckout = function (foodList, totalPrice, checkBox) {
            // checkOutItems.setVal(foodList, totalPrice);
            sessionService.set('foodList', JSON.stringify(foodList));
            sessionService.set('checkBox', JSON.stringify(checkBox));
            sessionService.set('totalPrice', totalPrice);
            $location.path('/checkout');
        }

    }])

    .service('checkOutItems', [function () {
        var foodListStore = "";
        var totalPriceStore = "";
        return {
            getFoodList: function () {
                return foodListStore;
            },
            getTotalPrice: function () {
                return totalPriceStore;
            },
            setVal: function (foodList, totalPrice) {
                foodListStore = foodList;
                totalPriceStore = totalPrice;
            }
        };
    }])

    .service('sessionService', function ($window) {
        var service = this;
        var sessionStorage = $window.sessionStorage;

        service.get = function (key) {
            return sessionStorage.getItem(key);
        };

        service.set = function (key, value) {
            sessionStorage.setItem(key, value);
        };

        service.unset = function (key) {
            sessionStorage.removeItem(key);
        };
    });