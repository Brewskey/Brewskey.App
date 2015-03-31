angular.module('tappt.controllers')
.controller('WriteTagsCtrl', ['$scope', '$stateParams', 'Restangular', function($scope, $stateParams, rest) {
	rest.one('api/locations/mine').get().then(function (response) {
		$scope.locations = response;
	});

	$scope.locationChanged = function (location) {
		_.each(location.taps, function (tap) {
			tap.selected = location.selected;
		});
	};

	$scope.tapChanged = function (location) {
		location.selected = _.filter(location.taps, function (tap) {
			return tap.selected;
		}).length == location.taps.length;
	}
}]);