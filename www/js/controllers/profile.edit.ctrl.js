angular.module('brewskey.controllers').controller('ProfileEditCtrl', [
  '$scope',
  'auth',
  '$localStorage',
  'utils',
  '$state',
  '$stateParams',
  '$ionicHistory',
  function($scope, auth, storage, utils, $state, $stateParams, $ionicHistory) {
    utils.shouldShowStartPour = false;
    $scope.isSetup = $stateParams.isSetup;
    $scope.model = angular.copy(storage.authDetails) || {};
    $scope.sending = false;

    $scope.submit = function() {
      $scope.errors = null;
      $scope.sending = true;
      var oldNumber = $scope.model.phoneNumber;
      auth
        .updateAccount($scope.model)
        .then(
          function(a) {
            $state.go('app.profile');
            return;

            if (storage.authDetails.phoneNumber !== oldNumber) {
              $scope.enterToken = true;
            } else if (storage.authDetails.phoneNumber) {
              $ionicHistory.currentView($ionicHistory.backView());
              $state.go('app.profile');
            }
          },
          function(error) {
            $scope.errors = utils.filterErrors(error);
          }
        )
        .finally(function() {
          $scope.sending = false;
        });
    };
    $scope.sendToken = function() {
      $scope.sending = true;
      $scope.errors = null;
      auth
        .sendPhoneToken($scope.model)
        .then(
          function(e) {
            auth.refreshToken().then(function() {
              $state.go('app.profile');
            });
          },
          function(error) {
            $scope.errors = utils.filterErrors(error);
          }
        )
        .finally(function() {
          $scope.model.token = null;
          $scope.sending = false;
        });
    };

    $scope.toggleForms = function() {
      $scope.model.token = null;
      $scope.errors = null;
      $scope.enterToken = !$scope.enterToken;
    };
  }
]);
