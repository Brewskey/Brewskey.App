angular.module('brewskey.controllers').controller('NewLocationCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$ionicHistory',
  '$state',
  'utils',
  function($scope, rest, $stateParams, $ionicHistory, $state, utils) {
    $scope.loaded = false;
    $scope.model = {
      id: $stateParams.locationId,
      locationType: null,
    };

    if ($scope.model.id) {
      rest
        .one('api/locations', $stateParams.locationId)
        .get()
        .then(function(response) {
          $scope.model = response;
          $scope.loaded = true;
        });
    } else {
      $scope.loaded = true;
    }

    $scope.editing = true;

    $scope.submitForm = function() {
      $scope.editing = false;

      var promise;

      if (!$scope.model.id) {
        promise = rest.all('api/locations').post($scope.model);
      } else {
        promise = $scope.model.put();
      }

      promise.then(
        function(response) {
          $scope.editing = true;

          $ionicHistory.goBack();
          $state.go('app.location', { locationId: response.id });
        },
        function(error) {
          $scope.editing = true;
          utils.filterErrors(error);
        }
      );
    };
  },
]);
