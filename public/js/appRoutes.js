angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})

		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard'
		})
		.when('/checkout',{
			templateUrl: 'views/checkout.html',
			controller: 'CheckoutController'
		})
		.when('/confirm',{
			templateUrl: 'views/confirmpayment.html',
			controller: 'ConfirmController'
		})
		;

	 $locationProvider.html5Mode(true);

}]);