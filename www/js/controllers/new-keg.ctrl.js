angular.module('tappt.controllers')
.controller('NewKegCtrl', ['$scope', 'Restangular', '$stateParams', '$ionicModal', '$ionicHistory', '$state', function($scope, rest, $stateParams, $ionicModal, $ionicHistory, $state) {
	$scope.model = {
		id: $stateParams.kegId,
		tapId: $stateParams.tapId
	};

	$scope.searchModel = {};

	if ($scope.model.id) {
		rest.one('api/kegs', $stateParams.tapId).get().then(function (response) {
			$scope.model = response;

			rest.one('api/beer/').get(response.beerId).then(function (beer) {
				$scope.beer = beer;
			});
		});
	}

	$ionicModal.fromTemplateUrl('find-beer.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.search = function () {
		rest.one('api/beer/search').get({
			query: $scope.searchModel.query
		}).then(function (result) {
			$scope.beers = result.data;
		});
	};

	$scope.selectBeer = function (beer) {
		$scope.beer = beer;
		$scope.model.beerId = beer.id;
		$scope.model.beerName = beer.name;
		$scope.model.beerIcon = beer.labels.icon;

		$scope.closeModal();
	};

	$scope.editing = false;

	$scope.submitForm = function () {
		$scope.editing = false;

		var promise;

		if (!$scope.model.id) {
			promise = rest.all('api/kegs').post($scope.model)
		} else {
			promise = $scope.model.put();
		}
		
		promise.then(function (response) {
	        $scope.editing = false;
	        
	        $ionicHistory.goBack();
	        $state.go('app.tap', { tapId: response.tapId });
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