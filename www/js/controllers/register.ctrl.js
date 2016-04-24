angular.module('tappt.controllers')
.controller('RegisterCtrl', ['$scope', 'auth', '$ionicHistory', '$state', function($scope, auth, $ionicHistory, $state) {
  // Form data for the login modal
  $scope.registering = false;
  $scope.registerData = {};

  // Perform the login action when the user submits the login form
  $scope.register = function() {
    $scope.registering = true;

    auth.register($scope.registerData)
      .then(function (response) {
        auth.login($scope.registerData).then(function () {
          // go to 
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          
          $state.go('app.home');
        })
      }, function (error) {
        $scope.registering = false;

        if (error.data && error.data.ModelState) {
          $scope.errors = error.data.ModelState;
        }
      });
  };
}]);