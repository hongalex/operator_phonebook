/*
 * Controllers for modifying data elements
 * Written by: Alex Hong 
 * With reference to Adam Bard (https://github.com/adambard/angular-elasticsearch-demo)
 *
 */

var phoneControllers = angular.module('phoneControllers',['elasticsearch']);

/* 
 * Login Controller 
 */
phoneControllers.controller('LoginController', ['$scope', '$location', '$rootScope', 
	function($scope, $location, $rootScope) {																																													
	$scope.submit = function () {

		/* Simple hashing function: 
		from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ */
		String.prototype.hashfunc = function(){
			var hash = 0;
			if (this.length == 0) return hash;
			for (i = 0; i < this.length; i++) {
				char = this.charCodeAt(i);
				hash = ((hash<<5)-hash)+char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		}
		var hash = $scope.password.hashfunc();

		//if($scope.username == "csc" && hash == $scope.a) {
			$rootScope.loggedIn = true;
			$location.path('/list');
		//} else {
		//	alert("Username or password incorrect. \nPlease try again");
		//}
	};
}]);

/* Angular JSON File Controller */
// phoneControllers.controller('ListController', ['$scope', '$http', function($scope, $http) {
//   $http.get('data/data.json').success(function(data) {
// 	$scope.lists = data;
// 	$scope.order = "department";
// 	$scope.display = "table";
// 	$scope.num_results = "50";
//   });
// }]); 


/**
 * ElasticSearch Controller.
 */
phoneControllers.controller('SearchController', 
	['searchService', '$scope', '$location', function(searchService, $scope, $location){

		// Initialize the scope defaults.
		$scope.order = "department";
		$scope.display = "table";
		$scope.num_results = "50";

		$scope.lists = [];
		$scope.page = 0;	

		$scope.query = $location.search().q;

		$scope.search = function(){
			if($scope.query.length >= 2) {
				$scope.page = 0;
				$scope.load();
			} else {
				$scope.lists = [];
				return;
			}
		};

		$scope.load = function(){
			searchService.search($scope.query, $scope.num_results).then(function(results){

					var tempList = [];
					for(var i=0; i < results.length; i++){
						tempList.push(results[i]);
					}
					$scope.lists = tempList;

				}, function(error) {
					$scope.error = error;
					$scope.lists = [];
			});
			
		};
		//Load the list
		$scope.load();
	}]
);
