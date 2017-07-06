angular.module('brewskey.controllers').controller('RegisterCtrl', [
  '$scope',
  'auth',
  '$stateParams',
  '$ionicHistory',
  '$state',
  'utils',
  '$ionicPopup',
  function($scope, auth, $stateParams, $ionicHistory, $state, utils, $ionicPopup) {
    // Form data for the login modal
    $scope.registering = false;
    $scope.registerData = {};

    $scope.externalAuthToken = $stateParams.externalAuthToken;

    // Perform the login action when the user submits the login form
    $scope.register = function() {
      $scope.registering = true;

      auth.register($scope.registerData).then(
        function(response) {
          auth.login($scope.registerData).then(function () {
            if (!$stateParams.externalAuthToken) {
              return;
            }

            return auth.addExternalLogin(
              $stateParams.externalAuthToken
            );
          }).then(function() {
            // go to
            $ionicHistory.nextViewOptions({
              historyRoot: true
            });

            $ionicPopup.alert({
              cssClass: 'green-popup',
              title: 'Almost done',
              template: 'Please enter your phone number. This allows your friends to add you by searching their phone contacts.',
            });

            $state.go('app.profile-edit', { isSetup: true });
          });
        },
        function(error) {
          $scope.registering = false;

          $scope.errors = utils.filterErrors(error);
        }
      );
    };
  },
]);
