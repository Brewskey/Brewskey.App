angular.module('brewskey.controllers')
.controller('NewTapCtrl', ['$scope', 'Restangular', '$stateParams', '$ionicHistory', '$state', function($scope, rest, $stateParams, $ionicHistory, $state) {
	$scope.model = {
	    deviceId: $stateParams.deviceId || undefined,
	    locationId: $stateParams.locationId || undefined,
	    id: $stateParams.tapId || undefined,
	};

	if ($scope.model.id) {
	    rest.one('api/taps', $stateParams.tapId).get().then(function (response) {
	        if (!response.currentKeg) {
	            response.currentKeg = {};
	        }

	        response.currentKeg.kegType += '';
	        $scope.model = response;
		    $scope.model.deviceId = $stateParams.deviceId || response.deviceId;
		    $scope.model.locationId = $stateParams.locationId || response.locationId;
		});
	}

	rest.all('api/devices').getList().then(function (devices) {
	    $scope.devices = devices;

	    if (devices && devices.length === 1) {
	        $scope.model.deviceId = devices[0].id;
	    }
	});
	rest.all('api/locations').getList().then(function (locations) {
	    $scope.locations = locations;

	    if (locations && locations.length === 1) {
	        $scope.model.locationId = locations[0].id;
	    }
	});

	$scope.editing = false;

	$scope.submitForm = function (form) {
		$scope.editing = true;

		var promise;

		if (!$scope.model.id) {
		    promise = rest.all('api/taps').post($scope.model);
		} else {
			promise = $scope.model.put();
		}
		
		promise.then(function (response) {
	        $scope.editing = false;

	        form.$setPristine();
	        $scope.$emit('tap-updated', response);

	        if (!$scope.model.id) {
	            $state.go('app.tap.edit', { tapId: response.id }, { replace: "replace" });
	        }
		}, function (error) {
	        $scope.editing = false;
	        if (!error.data) {
	          return;
	        }

	        if (error.data.ModelState) {
	          $scope.errors = error.data.ModelState;
	        }
	        if (error.data['error_description']) {
	          $scope.errorDescription = error.data['error_description'];
	        }
	        if (error.data.Message) {
	          $scope.errorDescription = error.data.Message;
	        }

      });
	};
}]);