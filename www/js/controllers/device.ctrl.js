angular.module('brewskey.controllers').controller('DeviceCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$state',
  '$ionicPopup',
  'modal',
  function($scope, rest, $stateParams, $state, $ionicPopup, modal) {
    $scope.loading = true;
    rest
      .one('api/devices', $stateParams.deviceId)
      .get()
      .then(function(response) {
        $scope.loading = false;
        $scope.device = response;
      });
    rest
      .one('api/devices', $stateParams.deviceId)
      .one('taps')
      .get()
      .then(function(response) {
        if (!response.length) {
          $ionicPopup.confirm({
            buttons: [
              {
                text: 'Set Up Taps',
                type: 'button-positive',
                onTap: function(e) {
                  $state.go('app.new-tap', { deviceId: $scope.device.id });
                },
              },
              {
                text: 'Not Now',
                type: 'button-neutral button-small',
              },
            ],
            cssClass: 'text-center green-popup popup-vertical-buttons',
            title: 'Add Some Taps!',
            template:
              "In order to finish setting up your Brewskey box you'll need to add some taps. " +
              'Each Brewskey box can have a maximum of four taps.',
          });
        }

        $scope.taps = response;
      });
    rest
      .one('api/devices', $stateParams.deviceId)
      .one('status')
      .get()
      .then(function(response) {
        $scope.particleStatus = response.particleStatus;
      });
    $scope.delete = function() {
      $scope.device.remove().then(function() {
        setTimeout(function() {
          $state.go('^', null, { reload: true });
        }, 500);
      });
    };
    $scope.resetToken = function() {
      rest
        .one('api/devices', $stateParams.deviceId)
        .one('reset-token')
        .get()
        .then(function(response) {
          $scope.device.clientSecret = response.clientSecret;
        });
    };
    $scope.getPercentLeft = function(keg) {
      return Math.max(0, (keg.maxOunces - keg.ounces) / keg.maxOunces * 100);
    };
    $scope.timeAgo = function(time) {
      return moment.utc(time).fromNow();
    };
    $scope.onTapHeld = function(tap) {
      modal.delete('Tap', 'api/taps', tap).then(function(result) {
        if (!result) {
          return;
        }
        $scope.taps = _.filter($scope.taps, function(t) {
          return t !== tap;
        });
      });
    };
  },
]);
