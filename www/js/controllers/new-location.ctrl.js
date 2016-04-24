angular.module('tappt.controllers')
.controller('NewLocationCtrl', ['$scope', 'Restangular', '$stateParams', '$ionicHistory', '$state', function($scope, rest, $stateParams, $ionicHistory, $state) {
	$scope.model = {
		id: $stateParams.locationId,
		locationType: null
	};

	if ($scope.model.id) {
		rest.one('api/locations', $stateParams.locationId).get().then(function (response) {
			$scope.model = response;
		});
	}

	$scope.editing = false;

	$scope.submitForm = function () {
		$scope.editing = false;

		var promise;

		if (!$scope.model.id) {
			promise = rest.all('api/locations').post($scope.model)
		} else {
			promise = $scope.model.put();
		}
		
		promise.then(function (response) {
	        $scope.editing = false;
	        
	        $ionicHistory.goBack();
	        $state.go('app.location', { locationId: response.id });
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