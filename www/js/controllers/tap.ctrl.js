angular.module('tappt.controllers')
.controller('TapCtrl', ['$scope', '$stateParams', 'Restangular', function($scope, $stateParams, rest) {
	rest.one('api/taps', $stateParams.tapId).get().then(function (response) {
		$scope.tap = response;
		$scope.canEdit = response.permissions && _.filter(response.permissions, function (permission) {
			return permission.permissionType === 3;
		}).length;

		$scope.tap.kegs = _.filter($scope.tap.kegs, function (keg) {
			return keg.id !== $scope.tap.currentKeg.id;
		})

		rest.one('api/beer/', response.currentKeg.beerId).get().then(function (response) {
			$scope.beer = response.data;
		});
	});
}]);