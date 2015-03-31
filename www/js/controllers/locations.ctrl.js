angular.module('tappt.controllers')
.controller('LocationsCtrl', ['$scope', 'Restangular', function($scope, rest) {
	rest.all('api/locations/mine').getList().then(function (locations) {
		$scope.locations = locations;
	});
}]);