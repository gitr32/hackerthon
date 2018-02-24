angular.module('CheckoutCtrl', [])
    .controller('CheckoutController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$mdToast', 'sessionService', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $mdToast, sessionService) {

        //retrieve transaction reference object to store transaction
        var transactRef = firebase.database().ref().child('Cart');
        $scope.checkoutItem = $firebaseObject(transactRef);

        var stripe = Stripe('pk_test_Z6hdfnWjzuAAJYFboYVfWAk4');
        var elements = stripe.elements();
        
    }]);