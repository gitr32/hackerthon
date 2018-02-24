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
		.when('/confirm',{
			templateUrl: 'views/confirmpayment.html',
			controller: 'ConfirmController'
		})
		;

	 $locationProvider.html5Mode(true);

}]);