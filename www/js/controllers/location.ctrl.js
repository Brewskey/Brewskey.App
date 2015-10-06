angular.module('tappt.controllers')
.controller('LocationCtrl', ['$scope', '$stateParams', 'Restangular', function($scope, $stateParams, rest) {
	
	rest.one('api/locations', $stateParams.locationId).get().then(function (response) {
		$scope.location = response;
		$scope.canEdit = response.permissions && _.filter(response.permissions, function (permission) {
			return permission.permissionType === 0 || permission.permissionType === 1;
		}).length;
	});
}]);