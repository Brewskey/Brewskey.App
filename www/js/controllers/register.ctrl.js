angular.module('brewskey.controllers')
.controller('RegisterCtrl', ['$scope', 'auth', '$ionicHistory', '$state', 'utils', '$ionicPopup',
function ($scope, auth, $ionicHistory, $state, utils, $ionicPopup) {
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

                  $ionicPopup.alert({
                      title: 'Almost done',
                      template: 'Please enter your phone number. This allows your friends to add you by searching their phone contacts.'
                  });

                  $state.go('app.profile-edit', { isSetup: true });
              })
          }, function (error) {
              $scope.registering = false;

              $scope.errors = utils.filterErrors(error);
          });
    };
}]);