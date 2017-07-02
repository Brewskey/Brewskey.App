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

    $scope.oauthLogin = function (provider) {
      var redirectUri = location.protocol + '//' + location.host + '/callback';
      var ref = window.open(
        'https://brewskey.com/api/Account/ExternalLogin/?provider=Facebook&redirectUri=' + redirectUri,
      //  'http://localhost:2484/api/Account/ExternalLogin/?provider=Facebook&redirectUri=' + redirectUri,

        'Authenticate Account',
        'location=0,status=0,width=600,height=750'
      );
      ref.addEventListener('load', function (event) {
        var url = event.target.URL;
        console.log(url)
        if(url.startsWith(redirectUri)) {
          ref.close();
        }
      })
    }

    // Perform the login action when the user submits the login form
    $scope.doLogin = function(modal) {
      $scope.loggingIn = true;

      auth.login($scope.loginData).then(
        function(response) {
          $scope.loggingIn = false;
          $scope.loginData = {};

          $ionicHistory.nextViewOptions({
            historyRoot: true,
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
  },
]);
