angular.module('brewskey.controllers').controller('LoginCtrl', [
  '$scope',
  'auth',
  '$ionicHistory',
  '$state',
  'utils',
  function($scope, auth, $ionicHistory, $state, utils) {
    // Form data for the login modal
    $scope.loggingIn = false;
    $scope.loginData = {};

    $scope.oauthLogin = function(provider) {
      auth.getExternalLoginPermission(provider).then(function(result) {
        var hasLocalAccount = result.hasLocalAccount;
        var externalAuthToken = result.externalAuthToken;
        if (hasLocalAccount === 'True') {
          auth.loginWithToken(externalAuthToken).then(function() {
            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $state.go('app.home');
          });
        } else {
          $scope.$apply(function() {
            $scope.externalAuthToken = externalAuthToken;
            $scope.showLoginForm = true;
          });
        }
      });
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function(modal) {
      $scope.loggingIn = true;

      auth
        .login($scope.loginData)
        .then(function() {
          if (!$scope.externalAuthToken) {
            return;
          }

          return auth.addExternalLogin($scope.externalAuthToken);
        })
        .then(
          function() {
            $scope.loggingIn = false;
            $scope.loginData = {};

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });

            if (modal) {
              modal.hide();
            } else {
              $state.go('app.home');
            }
          },
          function(error) {
            $scope.loggingIn = false;
            $scope.errors = utils.filterErrors(error);
          }
        );
    };
  }
]);
