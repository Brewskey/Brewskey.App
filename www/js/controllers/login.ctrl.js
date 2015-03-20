angular.module('tappt.controllers')
.controller('LoginCtrl', ['$scope', 'restangular' function($scope) {
  // Form data for the login modal
  $scope.loggingIn = false;
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $scope.loggingIn = true;

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      
    }, 1000);
  };
});