angular.module('brewskey').controller('NewDeviceCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$state',
  'modal',
  '$ionicHistory',
  '$ionicPopup',
  'utils',
  function(
    $scope,
    rest,
    $stateParams,
    $state,
    modal,
    $ionicHistory,
    $ionicPopup,
    utils
  ) {
    $scope.model = {
      id: $stateParams.deviceId || undefined,
      particleId: $stateParams.particleId || undefined
    };
    $scope.deviceStatusTypes = [
      { value: 1, text: 'Active' },
      { value: 2, text: 'Disabled' },
      { value: 3, text: 'Cleaning' },
      { value: 4, text: 'Open Valve' }
    ];
    $scope.statusModel = $scope.deviceStatusTypes[0];
    if ($scope.model.id) {
      $scope.particleIdLoaded = true;
      $scope.particleIdValid = true;
      rest
        .one('api/devices', $stateParams.deviceId)
        .get()
        .then(function(response) {
          $scope.statusModel = _.find($scope.deviceStatusTypes, function(item) {
            return item.value === response.deviceStatus;
          });
          $scope.model = response;
          $scope.isAdmin = (response.permissions || []).some(function(p) {
            return p.permissionType === 0;
          });
        });
    }
    $scope.editing = true;
    $scope.cancel = function() {
      if ($scope.model.id) {
        $ionicHistory.currentView($ionicHistory.backView());
        $state.go('^.details', { deviceId: $scope.model.id });
      } else {
        $state.go('^');
      }
    };

    function showLocationPopup() {
      // If locations still aren't showing up, show a modal to redirect
      // them to create a location or refresh the list.
      $ionicPopup.show({
        cssClass: 'text-center green-popup popup-vertical-buttons',
        title: 'Could not find any locations',
        scope: $scope,
        subTitle:
          "We didn't find any locations for your account.  In order " +
          'to set up a device you need some locations',
        buttons: [
          {
            text: '<b>Refresh Locations</b>',
            type: 'button-balanced',
            onTap: function(event) {
              getLocations();
            }
          },
          {
            text: '<b>Create New Location</b>',
            type: 'button-positive',
            onTap: function(event) {
              $state.go('app.new-location');
            }
          }
        ]
      });
    }

    var counter = 0;
    function handleLocationsNotFound() {
      if (counter >= 3) {
        showLocationPopup();
        return;
      }

      counter++;
      setTimeout(function() {
        getLocations();
      }, 1000);
    }
    function getLocations() {
      rest
        .all('api/locations')
        .getList()
        .then(function(locations) {
          if (!locations || !locations.length) {
            handleLocationsNotFound();
            return;
          }

          $scope.locations = locations;

          if (locations && locations.length === 1) {
            $scope.model.locationId = locations[0].id;
          }
        }, handleLocationsNotFound);
    }
    getLocations();
    $scope.submitForm = function() {
      if (
        navigator.connection &&
        navigator.connection.type === Connection.NONE
      ) {
        return;
      }

      if (!$scope.form.$valid) {
        return;
      }
      $scope.disabled = true;
      $scope.editing = false;
      var promise;
      $scope.model.deviceStatus = $scope.statusModel.value;
      $scope.model.deviceType = 0;
      if (!$scope.model.id) {
        promise = rest.all('api/devices').post($scope.model);
      } else {
        promise = $scope.model.put();
      }
      promise
        .then(
          function(response) {
            $ionicHistory.currentView($ionicHistory.backView());
            $state.go(
              'app.device',
              { deviceId: response.id },
              { location: 'replace' }
            );
          },
          function(error) {
            $scope.editing = true;
            if (!error.data) {
              return;
            }
            console.log(error);
            $scope.errors = utils.filterErrors(error);
          }
        )
        .finally(function() {
          $scope.disabled = false;
        });
    };
    $scope.getDeviceStatus = function() {
      $scope.particleIdLoaded = false;
      $scope.particleIdValid = false;
      $scope.particleIdInUse = false;
      $scope.particleIdError = false;
      if (!$scope.model.particleId) {
        return;
      }
      rest
        .one('api/devices/particle', $scope.model.particleId)
        .one('status')
        .get()
        .then(function(response) {
          $scope.particleIdLoaded = true;
          $scope.particleIdValid = response.status === 0;
          $scope.particleIdInUse = response.status !== 0;
        })
        .catch(function(exception) {
          $scope.particleIdLoaded = true;
          $scope.particleIdError = true;
        });
    };
    if ($scope.model.particleId) {
      function onOffline() {
        document.removeEventListener('offline', onOffline);
        document.addEventListener('online', onOnline, false);
      }

      function onOnline() {
        document.removeEventListener('online', onOnline);
        $scope.getDeviceStatus();
      }

      document.addEventListener('offline', onOffline, false);
    }

    $scope.deleteDevice = function() {
      modal
        .delete('Brewskey Box', 'api/devices', $scope.model)
        .then(function(res) {
          if (!res) {
            return;
          }
          $ionicHistory.clearCache();
          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
          });
          $state.go('app.devices');
        });
    };
  }
]);
