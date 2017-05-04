angular.module('brewskey.controllers').controller('TapSetBeverageCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$ionicHistory',
  '$state',
  '$ionicPopup',
  'utils',
  function(
    $scope,
    rest,
    $stateParams,
    $ionicHistory,
    $state,
    $ionicPopup,
    utils
  ) {
    rest.one('api/taps', $stateParams.tapId).get().then(function(response) {
      if (!response.currentKeg) {
        response.currentKeg = { startingPercentage: 100 };
      }

      response.currentKeg.kegType += '';
      $scope.model = response;
    });
  },
]);
