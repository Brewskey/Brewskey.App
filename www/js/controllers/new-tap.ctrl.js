angular.module('brewskey.controllers').controller('NewTapCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$ionicHistory',
  '$state',
  'modal',
  'utils',
  function($scope, rest, $stateParams, $ionicHistory, $state, modal, utils) {
    $scope.model = {
      deviceId: $stateParams.deviceId || undefined,
      locationId: $stateParams.locationId || undefined,
      id: $stateParams.tapId || undefined
    };
    $scope.isDeviceSelectorReadOnly = false;

    if ($scope.model.id) {
      rest
        .one('api/taps', $stateParams.tapId)
        .get()
        .then(function(response) {
          if (!response.flowSensorId) {
            $state.go(
              'app.tap.set-sensor',
              { tapId: response.id },
              { location: 'replace' }
            );
            return;
          } else if (!response.currentKeg) {
            $state.go(
              'app.tap.set-beverage',
              { tapId: response.id },
              { location: 'replace' }
            );
            return;
          }

          response.currentKeg.kegType += '';
          response.currentKeg.beverageName = response.currentKeg.beverage.name;
          response.currentKeg.beverageId = response.currentKeg.beverage.id;
          $scope.model = response;
          $scope.isAdmin = (response.permissions || []).some(function(p) {
            return p.permissionType === 0;
          });
          $scope.model.deviceId = $stateParams.deviceId || response.deviceId;
        });
    }

    rest
      .all('api/devices')
      .getList()
      .then(function(devices) {
        $scope.devices = devices;

        if (devices && devices.length === 1) {
          $scope.model.deviceId = devices[0].id;
        }

        $scope.isDeviceSelectorReadOnly = (devices || []).some(function(
          device
        ) {
          return device.id === $stateParams.deviceId;
        });
      });

    $scope.editing = false;

    $scope.submitForm = function(form) {
      $scope.editing = true;

      var promise;

      if (!$scope.model.id) {
        promise = rest.all('api/taps').post($scope.model);
      } else {
        promise = $scope.model.put();
      }

      promise.then(
        function(response) {
          $scope.editing = false;
          $scope.errors = null;

          form.$setPristine();
          $scope.$emit('tap-updated', response);

          if (!$scope.model.id) {
            $ionicHistory.currentView($ionicHistory.backView());
            $state.go(
              'app.tap.set-sensor',
              { tapId: response.id },
              { location: 'replace' }
            );
          }
        },
        function(error) {
          $scope.editing = false;

          $scope.errors = utils.filterErrors(error);
        }
      );
    };

    $scope.deleteTap = function() {
      modal.delete('Tap', 'api/taps', $scope.modal).then(function(res) {
        if (!res) {
          return;
        }

        $scope.editing = false;
        $ionicHistory.clearCache();
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('app.taps');
      });
    };

    $scope.updateSensor = function() {
      $state.go(
        'app.tap.set-sensor',
        { tapId: $scope.model.id },
        { location: 'replace' }
      );
    };
  }
]);
