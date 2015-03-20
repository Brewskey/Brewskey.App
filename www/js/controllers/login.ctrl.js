angular.module('tappt.controllers')
.controller('LoginCtrl', ['$scope', 'auth', '$ionicHistory', '$state', function($scope, auth, $ionicHistory, $state) {
  // Form data for the login modal
  $scope.loggingIn = false;
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $scope.loggingIn = true;

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    auth.login($scope.loginData)
      .then(function (response) {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('app.home');
      }, function (error) {
        $scope.loggingIn = false;
        if (!error.data) {
          return;
        }

        if (error.data.ModelState) {
          $scope.errors = error.data.ModelState;
        }
        if (error.data['error_description']) {
          $scope.errorDescription = error.data['error_description'];
        }
      });
  };
}]);