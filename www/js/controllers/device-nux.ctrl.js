angular.module('brewskey.controllers').controller('DeviceNUXCtrl', [
  '$scope',
  '$ionicModal',
  function($scope, $ionicModal) {
    $scope.foo = 'bar';
    $ionicModal
      .fromTemplateUrl('templates/modals/nux-install-device.html', {
        scope: $scope,
        animation: 'slide-in-up',
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.closeModal = function() {
      $scope.modal.remove().then(function() {
        $scope.modal = null;
      });
    };
    $scope.onShowInstallNUX = function() {
      $scope.modal.show();
    };
  },
]);
