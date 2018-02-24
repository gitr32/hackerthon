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
		;

	 $locationProvider.html5Mode(true);

}]);