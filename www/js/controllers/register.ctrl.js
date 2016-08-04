angular.module('brewskey.controllers')
.controller('RegisterCtrl', ['$scope', 'auth', '$ionicHistory', '$state', 'utils',
function ($scope, auth, $ionicHistory, $state, utils) {
    // Form data for the login modal
    $scope.registering = false;
    $scope.registerData = {};

    // Perform the login action when the user submits the login form
    $scope.register = function () {
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

              $scope.errors = utils.filterErrors(error);
          });
    };
}]);