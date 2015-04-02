angular.module('tappt.controllers')
.controller('WriteTagsCtrl', ['$scope', '$stateParams', 'Restangular', 'nfc', '$ionicPopup', function($scope, $stateParams, rest, nfc, $ionicPopup) {	rest.one('api/locations/mine').get().then(function (response) {
		$scope.locations = response;
	});

	$scope.locationChanged = function (location) {
		_.each(location.taps, function (tap) {
			tap.selected = location.selected;
		});

		$scope.anySelected = getTapIds().length;
	};

	$scope.tapChanged = function (location) {
		location.selected = _.filter(location.taps, function (tap) {
			return tap.selected;
		}).length == location.taps.length;
	
		$scope.anySelected = getTapIds().length;
	};

	$scope.writing = false;
	
	$scope.writeTags = function () {
		$scope.writing = true;
		var tapIds = getTapIds();

		if (!tapIds.length) {
			$scope.writing = false;
			return;
		}

		rest.one('api/authorize').post('tag', { tapIds: tapIds })
			.then(function (response) {
			    nfc.writeTag(response)
					.then(function () {
					    $scope.writing = false;
					    $ionicPopup.alert({
					    	title: 'Successfully wrote tag!'
					    });
					},
					function () {
					    $scope.writing = false;
					    $ionicPopup.alert({
					    	title: 'Error writing Tag!',
					    	template: 'Sorry, there was an error when writing your tag.  Please try again later.'
					    });
					});
			});
	};

	
	function getTapIds() {
		var tapIds = [];
		_.each($scope.locations, function (location) {
			var filteredTaps = _.filter(location.taps, function (tap) {
				return tap.selected;
			});

			tapIds = tapIds.concat(_.pluck(filteredTaps, 'id'));
		});

		return tapIds;
	}
}]);