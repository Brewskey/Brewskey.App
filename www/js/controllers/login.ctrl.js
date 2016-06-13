angular.module('brewskey.controllers')
.controller('LoginCtrl', ['$scope', 'auth', '$ionicHistory', '$state', function($scope, auth, $ionicHistory, $state) {
  // Form data for the login modal
  $scope.loggingIn = false;
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(modal) {
    $scope.loggingIn = true;

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    auth.login($scope.loginData)
      .then(function (response) {
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
      }, function (error) {
        $scope.loggingIn = false;
        if (!error.data) {
          return;
        }

        if (error.data.ModelState) {
          $scope.errors = error.data.ModelState;
        } else if (error.data['error_description']) {
          $scope.errorDescription = error.data['error_description'];
        } else {
            $scope.errorDescription = 'Whoa! Brewskey had an error.  We\'ll try to get it fixed soon.';
        }
      });
  };
}]);