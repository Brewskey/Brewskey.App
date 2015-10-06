angular.module('tappt.controllers')
.controller('LocationsCtrl', ['$scope', 'Restangular', function($scope, rest) {
	rest.all('api/locations').getList().then(function (locations) {
		$scope.locations = locations;
	});
}]);