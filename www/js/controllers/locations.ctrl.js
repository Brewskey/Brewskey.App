angular.module('brewskey.controllers').controller('LocationsCtrl', [
  '$scope',
  'Restangular',
  function($scope, rest) {
    $scope.loading = true;
    rest
      .all('api/locations')
      .getList()
      .then(function(locations) {
        $scope.locations = locations;
      })
      .finally(function() {
        $scope.loading = false;
      });
  },
]);
