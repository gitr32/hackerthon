angular.module('CheckoutCtrl', [])
    .controller('CheckoutController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$mdDialog', 'checkOutItems', '$location', '$mdToast', 'sessionService', '$window', '$http', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $firebaseAuth, $mdDialog, checkOutItems, $location, $mdToast, sessionService, $window, $http) {

        //retrieve transaction reference object to store transaction
        var transactRef = firebase.database().ref().child('Cart');
        $scope.cartItemsArr = $firebaseArray(transactRef);

        var transactRefArr = $firebaseArray(transactRef);

        // method to assign total price to the cart
        $scope.showShippingFeeAndCalculateTotal = function (shippingCost) {
            transactRefArr.$loaded().then(function (menu) {
                //must first check for keys, then bind it to the array
                var totalPrice = 0;
                for (var i in menu) {
                    if (menu[i]['qty'] != undefined && menu[i]['price'] != undefined) {
                        totalPrice += (menu[i]['qty'] * menu[i]['price'])
                    }

                }
                
                if(shippingCost != undefined){
                    totalPrice += shippingCost;
                    $scope.checkoutShippingFee = shippingCost;
                }

                $scope.checkoutTotal = totalPrice;
            })
        }

        // Get initial total price WITHOUT shipping
        $scope.showShippingFeeAndCalculateTotal();

        // Get shipping rates
        var items = [];
        transactRefArr.$loaded().then(function (cartItems) {
            for (var i in cartItems) {
                var itemToAppend = {};
                var currentItemDimensions = cartItems[i]['dimensions'];
                if (cartItems[i]['qty'] != undefined && cartItems[i]['price'] != undefined) {
                    itemToAppend['actual_weight'] = currentItemDimensions['weight'];
                    itemToAppend['height'] = currentItemDimensions['height'];
                    itemToAppend['width'] = currentItemDimensions['width'];
                    itemToAppend['length'] = currentItemDimensions['length'];
                    itemToAppend['category'] = 'watch';
                    itemToAppend['declared_currency'] = 'USD';
                    itemToAppend['declared_customs_value'] = cartItems[i]['price'];

                    items.push(itemToAppend);
                }
            }
        })

        $scope.response = '';
        var options = {
            method: 'POST',
            url: 'https://api.easyship.com/rate/v1/rates',
            headers:
                {
                    'Cache-Control': 'no-cache',
                    'Authorization': 'Bearer sand_cSao/FwYNZ+Tyvyb/pENjoC1vw7TT91Nra4daTDNPOs=',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            data:
                {
                    origin_country_alpha2: 'US',
                    origin_postal_code: '45373',
                    origin_state: 'OH',
                    destination_country_alpha2: 'SG',
                    destination_postal_code: '45373',
                    taxes_duties_paid_by: 'Receiver',
                    is_insured: true,
                    items:
                        [{
                            actual_weight: 10,
                            height: 1,
                            width: 1,
                            length: 1,
                            category: 'documents',
                            declared_currency: 'USD',
                            declared_customs_value: 36.79
                        }]
                },
            json: true
        };

        $http(options)
            .then(function successCallback(response) {
                $scope.courierRates = response.data.rates;
                console.log("response isss: ", response.data.rates);
            }, function errorCallback(response) {
                console.log(response);
            });


        var stripe = Stripe('pk_test_Z6hdfnWjzuAAJYFboYVfWAk4');
        var elements = stripe.elements();

        // Custom styling can be passed to options when creating an Element.
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // Create an instance of the card Element.
        var card = elements.create('card', { style: style });

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');

        // Handle real-time validation errors from the card Element.
        card.addEventListener('change', function (event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        // Handle form submission.
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    // Inform the user if there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Store token for use later on
                    $scope.currentUserStripeToken = result.token;

                    // Redirect user to select shipment page
                    $window.location.href = '/cart';

                    // Send the token to your server.
                    // stripeTokenHandler(result.token);
                }
            });
        });

        function stripeTokenHandler(token) {
            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();
        }
    }]);