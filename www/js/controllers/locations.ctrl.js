angular.module('brewskey.controllers').controller('LocationsCtrl', [
  '$scope',
  'Restangular',
  'modal',
  'utils',
  function($scope, rest, modal, utils) {
    utils.shouldShowStartPour = false;

    $scope.refresh = function() {
      $scope.loading = true;
      rest
        .all('api/locations')
        .getList()
        .then(function(locations) {
          $scope.locations = locations;
        })
        .finally(function() {
          $scope.loading = false;
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.refresh();

    $scope.onLocationHeld = function(location) {
      modal
        .delete(location.name, 'api/locations', location)
        .then(function(result) {
          if (!result) {
            return;
          }
          $scope.locations = _.filter($scope.locations, function(l) {
            return l !== location;
          });
        });
    };
  }
]);
