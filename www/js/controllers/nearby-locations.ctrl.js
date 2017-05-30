angular.module('brewskey.controllers').controller('NearyLocationsCtrl', [
  '$scope',
  'Restangular',
  'nfcService',
  '$ionicPlatform',
  'gps',
  function($scope, rest, nfcService, $ionicPlatform, gps) {
    $scope.loading = true;

    $scope.getPercentLeft = function(keg) {
      return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
    };

    $scope.getNearbyLocations = function() {
      gps.getCoords().then(function(coordinates) {
        coords = coordinates;
        rest
          .one('api/locations/nearby')
          .get({
            longitude: coords.longitude,
            latitude: coords.latitude,
            radius: 1500,
          })
          .then(function(response) {
            $scope.locations = response;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
          });
      });
    };

    $scope.getNearbyLocations();

    $scope.showPopup = function(deviceId) {
      $scope.$emit('device-id', deviceId);
      nfcService.showPopup();
    };
  },
]);
