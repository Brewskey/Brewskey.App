<<<<<<< HEAD
angular.module('brewskey.controllers')
    .controller('DevicesCtrl', [
    '$scope', 'Restangular', 'modal',
    function ($scope, rest, modal) {
        $scope.loading = true;

        $scope.refresh = function () {
            rest.all('api/devices').getList().then(function (devices) {
                $scope.devices = devices;
            }).finally(function () {
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.refresh();

        $scope.onDeviceHeld = function (device) {
          modal.delete('Brewskey Box', 'api/devices', device)
            .then(function (result) {
              if (!result) {
                return;
              }
              $scope.devices = _.filter($scope.devices, function (d) {
                  return d !== device;
              });
            });
        };
    }
]);
=======
angular.module('brewskey.controllers').controller('DevicesCtrl', [
  '$scope',
  'Restangular',
  function($scope, rest) {
    $scope.loading = true;

    $scope.refresh = function() {
      rest
        .all('api/devices')
        .getList()
        .then(function(devices) {
          $scope.devices = devices;
        })
        .finally(function() {
          $scope.loading = false;
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.refresh();
  },
]);
>>>>>>> 2773b5ddce7b41ac35feb246e97d991357e4b40d
