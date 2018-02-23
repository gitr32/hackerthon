angular.module('ConfirmCtrl', [])
    .controller('ConfirmController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', 'websocketService', '$mdToast', 'sessionService', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, websocketService, $mdToast, sessionService) {
        //retrieve foodList and total price
        // var foodList = checkOutItems.getFoodList();
        // var totalPrice = checkOutItems.getTotalPrice();

        var foodList = JSON.parse(sessionService.get('foodList'));
        var totalPrice = sessionService.get('totalPrice');

        //retrieve transaction reference object to store transaction
        var transactRef = firebase.database().ref().child('Transaction');
        var transactRefObj = $firebaseArray(transactRef);

        //retrieve ezlink tap image for display
        var ezLinkTapRef = firebase.database().ref().child('EzlinkTap');
        var ezLinkTapObj = $firebaseObject(ezLinkTapRef);
        $scope.ezLinkTap = ezLinkTapObj;

        websocketService.start("ws://localhost:8081", function (evt) {
            // console.log('evt is : ',evt.data)
            var obj = (evt.data);
            $scope.$apply(function () {
                // var audio = new Audio('sound/Beep.mp3');
                // audio.play();
                $scope.msg = obj;
                // console.log("test msg: ", $scope.msg);
                if ($scope.msg !== 'null') {
                    var date = new Date();
                    var dateStr = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                    //store in json object
                    var transactionObj = {
                        [dateStr]: {
                            cart: foodList,
                            total: totalPrice,
                            payment_type: 'Ezlink'
                        }
                    }
                    var audio = new Audio('sound/Beep.mp3');
                    audio.play();
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
            });
        })
    }])
