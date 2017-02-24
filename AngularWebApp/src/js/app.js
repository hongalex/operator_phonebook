var myApp = angular.module('myApp', [
	'ngRoute',
	'focus-if',
	'phoneControllers'
]);

myApp.debug = true;

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/login', {
		templateUrl: 'partials/login.html',
		controller: 'LoginController'
	}).
	when('/list', {
		resolve: {
			"check": function($location, $rootScope) {
				if(!myApp.debug) { //Debugging mode
					if(!$rootScope.loggedIn) {
						$location.path('/');
					}
				}
			}
		},
		templateUrl: 'partials/list.html',
		controller: 'SearchController'
	}).
	when('/test', {
		templateUrl: 'partials/404.html'
	}).
	when('/error', {
		templateUrl: 'partials/404.html'
	}).
	otherwise({
		redirectTo: '/list'
	});
}]);