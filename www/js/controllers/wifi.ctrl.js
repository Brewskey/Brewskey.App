angular.module('brewskey.controllers').controller('WifiCtrl', [
  '$scope',
  'Restangular',
  'softAP',
  '$ionicPopup',
  '$stateParams',
  '$state',
  '$ionicHistory',
  function($scope, rest, softAP, $ionicPopup, $stateParams, $state, $ionicHistory) {
    $scope.state = 0;
    $scope.hiddenForm = false;
    $scope.model = { security: 'wpa2_aes' };
    $scope.device = null;
    $scope.selectedNetwork = null;
    $scope.isCreatingNewDevice = $stateParams.isCreatingNewDevice;

    // Check if there is an existing location in order to create the device
    if ($stateParams.isCreatingNewDevice) {
      rest
        .all('api/locations')
        .getList()
        .then(function(locations) {
          if (locations.length) {
            return;
          }

          return $ionicPopup.show({
            cssClass: 'green-popup',
            title: 'You haven\'t created any locations!',
            subTitle: 'In order to set up your Brewskey box, you first need ' +
              'to create a location.',
            scope: $scope,
            buttons: [
              {
                text: '<b>Go Now</b>',
                type: 'button-positive',
                onTap: function() {
                  $state.go('app.new-location');
                }
              },
              {
                text: 'No Thanks',
                onTap: function() {
                  $ionicHistory.goBack();
                }
              }
            ]
          })
        });
    }

    $scope.securityTypes = [
      { key: 'No Security', value: 'open' },
      { key: 'WEP pre-shared key', value: 'wep_psk' },
      { key: 'Open WEP', value: 'wep_shared' },
      { key: 'WPA with TKIP', value: 'wpa_tkip' },
      { key: 'WPA with AES', value: 'wpa_aes' },
      { key: 'WPA2 with TKIP', value: 'wpa2_tkip' },
      { key: 'WPA2 with AES', value: 'wpa2_aes' },
      { key: 'WPA2 AES & TKIP', value: 'wpa2_mixed' },
    ];

    $scope.reset = function() {
      $scope.state = 0;
      runState();
    };

    $scope.nextState = function() {
      $scope.state++;
      runState();
    };

    $scope.previousState = function() {
      $scope.state--;
      runState();
    };

    $scope.selectNetwork = function(network) {
      $scope.selectedNetwork = network;
      $scope.model.password = '';
    };

    $scope.onUseInternalDeviceID = function() {
      $scope.useInternal = true;
    };

    $scope.connect = function(usingForm) {
      $scope.disabled = true;
      var network = $scope.selectedNetwork;
      softAP
        .configure({
          ssid: usingForm ? $scope.model.ssid : network.ssid,
          channel: usingForm ? 3 : network.ch,
          password: $scope.model.password,
          security: usingForm
            ? $scope.model.security
            : softAP.securityLookup(network.sec),
        })
        .then(function() {
          return softAP.connect();
        })
        .then(function(result) {
          $scope.nextState();
        })
        .catch(function(err) {
          $scope.nextState();
        })
        .finally(function() {
          $scope.disabled = false;
        });
    };

    $scope.toggleForm = function() {
      $scope.hiddenForm = !$scope.hiddenForm;
    };

    $scope.submitInternalID = function(internalId) {
      $ionicHistory.currentView($ionicHistory.backView());
      $state.go(
        'app.new-device',
        { particleId: internalId },
        { location: 'replace' }
      );
    };

    function error() {
      $ionicPopup
        .alert({
          cssClass: 'alert-error green-popup',
          title: 'Wifi Setup Error',
          template: 'There was an error when attempting to setup the wifi on your device.  Please ' +
            'try resetting the device and if that fails, restart the Brewskey app.',
        })
        .then(function() {
          $scope.state = 0;
        });
    }

    function runState() {
      if ($scope.state === 1) {
        softAP
          .deviceReady()
          .then(function(result) {
            $scope.device = result;
            $scope.nextState();
          })
          .catch(error);
      } else if ($scope.state === 2) {
        softAP
          .scan()
          .then(function(result) {
            $scope.networks = result;
          })
          .catch(error);
        softAP.publicKey();
      } else if ($scope.state === 3) {
        if ($stateParams.isCreatingNewDevice) {
          $ionicHistory.currentView($ionicHistory.backView());
          $state.go(
            'app.new-device',
            { particleId: $scope.device.id },
            { location: 'replace' }
          );
        }
      }
    }
  },
]);
