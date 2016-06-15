angular.module('brewskey.controllers')
.controller('NewTapCtrl', ['$scope', 'Restangular', '$stateParams', '$ionicHistory', '$state', function($scope, rest, $stateParams, $ionicHistory, $state) {
	$scope.model = {
		id: $stateParams.tapId,
		locationId: $stateParams.locationId
	};

	if ($scope.model.id) {
		rest.one('api/taps', $stateParams.tapId).get().then(function (response) {
		    response.currentKeg.kegType += '';
		    $scope.model = response;
		});
	}

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