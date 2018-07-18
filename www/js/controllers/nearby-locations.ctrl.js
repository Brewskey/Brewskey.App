angular.module('brewskey.controllers').controller('NearyLocationsCtrl', [
  '$scope',
  'Restangular',
  'nfcService',
  '$ionicPlatform',
  'gps',
  '$stateParams',
  '$ionicModal',
  'utils',
  function(
    $scope,
    rest,
    nfcService,
    $ionicPlatform,
    gps,
    $stateParams,
    $ionicModal,
    utils
  ) {
    $scope.loading = true;

    $scope.getPercentLeft = utils.getPercentLeft;

    $scope.getNearbyLocations = function() {
      gps.getCoords().then(function(coordinates) {
        coords = coordinates;
        rest
          .one('api/locations/nearby')
          .get({
            longitude: coords.longitude,
            latitude: coords.latitude,
            radius: 1500
          })
          .then(function(response) {
            $scope.locations = response;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
          });
      });
    };

    $scope.getNearbyLocations();

    $scope.showPopup = function(event, deviceId) {
      event.preventDefault();
      event.stopPropagation();
      $scope.$emit('device-id', deviceId);
      nfcService.showPopup().then(function() {
        $scope.$emit('device-id', null);
      });
      return false;
    };

    //if (true) {
    // $ionicModal
    //   .fromTemplateUrl('templates/modals/nux.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up',
    //   })
    //   .then(function(modal) {
    //     $scope.modal = modal;
    //     //  modal.show();
    //   });
    // $scope.closeModal = function() {
    //   $scope.modal.hide();
    // };
    // // Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //   // Execute action
    // });
    //}
  }
]);
