angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard'
		})
		.when('/cart',{
			templateUrl: 'views/cart.html',
			controller: 'CartController'
		})
		.when('/checkout',{
			templateUrl: 'views/checkout.html',
			controller: 'CheckoutController'
		})
		.when('/confirm',{
			templateUrl: 'views/confirmpayment.html',
			controller: 'ConfirmController'
		})
		.when('/selectedItem',{
			templateUrl: 'views/selectedItem.html',
			controller: 'SelectedItemController'
		})
		.when('/facebookLogin',{
			templateUrl: 'views/facebookLogin.html',
			controller: 'FacebookController'
		})
		;

	 $locationProvider.html5Mode(true);

}]);