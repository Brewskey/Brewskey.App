angular.module('tappt.controllers')
.controller('KegCtrl', ['$scope', '$stateParams', 'Restangular', function($scope, $stateParams, rest) {
	rest.one('api/kegs', $stateParams.kegId).get().then(function (response) {
		$scope.tap = response;
		$scope.canEdit = response.permissions && _.filter(response.permissions, function (permission) {
			return permission.permissionType === 3;
		}).length;
	});
}]);