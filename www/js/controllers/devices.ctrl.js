angular.module('brewskey.controllers').controller('DevicesCtrl', [
  '$scope',
  'Restangular',
  'modal',
  'utils',
  function($scope, rest, modal, utils) {
    $scope.loading = true;
    utils.shouldShowStartPour = false;

    var counter = 0;
    $scope.refresh = function() {
      rest
        .all('api/devices')
        .getList()
        .then(function(devices) {
          $scope.devices = devices.map(function(device) {
            return device;
          });
        })
        .finally(function() {
          $scope.loading = false;
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.refresh();

    $scope.onDeviceHeld = function(device) {
      modal
        .delete('Brewskey Box', 'api/devices', device)
        .then(function(result) {
          if (!result) {
            return;
          }
          $scope.devices = _.filter($scope.devices, function(d) {
            return d !== device;
          });
        });
    };
  }
]);
