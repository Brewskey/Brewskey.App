angular.module('brewskey.controllers').controller('SettingsCtrl', [
  '$scope',
  '$localStorage',
  'auth',
  function($scope, $localStorage, auth) {
    $scope.settings = $localStorage.settings;
    $scope.userLogins = $localStorage.authDetails.userLogins;
    $scope.hasLogin = function (externalLogin) {
      return !_.find($scope.userLogins, function (login) {
        return login.LoginProvider === externalLogin;
      });
    };
    $scope.settingChange = function() {
      $localStorage.settings = $scope.settings;
      $scope.$emit('settingChanged', $scope.settings);
    };

    $scope.loading = false;
    $scope.oauthAdd = function (loginProvider) {
      $scope.loading = true;
      auth.getExternalLoginPermission(loginProvider)
        .then(
          function (response) {
            return auth.addExternalLogin(response.externalAuthToken);
          }
        ).then(function (response) {
          $scope.$apply(function () {
            $scope.loading = false;
            $scope.userLogins = $localStorage.authDetails.userLogins;
          });
        });
    };
    $scope.oauthRemove = function (loginProvider) {
      $scope.loading = true;
      var provider = $scope.userLogins.find(function (provider) {
        return provider.LoginProvider === loginProvider;
      });
      auth.removeExternalLogin(
        provider.LoginProvider,
        provider.ProviderKey
      ).then(function () {
        $scope.loading = false;
        $scope.userLogins = $localStorage.authDetails.userLogins;
      });
    };
  },
]);
