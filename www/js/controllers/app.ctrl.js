angular
  .module('brewskey.controllers', [])
  .controller('AppCtrl', function(
    $rootScope,
    $scope,
    auth,
    $localStorage,
    $ionicHistory,
    $state,
    nfcService,
    $ionicSideMenuDelegate,
    friends
  ) {
    $scope.isLoggedIn = auth.isLoggedIn;

    if ($localStorage.authDetails) {
      $scope.userName = $localStorage.authDetails.userName;
    }

    $scope.settings = $localStorage.settings;

    $scope.$on('settingChanged', function(event, settings) {
      $scope.settings = $localStorage.settings = settings;
    });
    $scope.$on('userChanged', function(event, account) {
      $localStorage.authDetails = account;
      $scope.userName = $localStorage.authDetails.userName;
    });

    $scope.$watch(
      function() {
        return $ionicSideMenuDelegate.getOpenRatio();
      },
      function(value) {
        if (!value) {
          return;
        }

        friends.getRequests().then(function(requests) {
          $scope.friendRequestCount = requests.length;
        });
      }
    );

    $scope.logout = function() {
      auth.logout();

      $ionicHistory.nextViewOptions({
        historyRoot: true,
      });

      $state.go('app.login');
    };

    $scope.showPopup = function() {
      nfcService.showPopup();
    };

    $rootScope.$on('device-id', function(event, value) {
      $scope.deviceId = value;
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (toState.name.indexOf('app.tap.') === 0) {
        return;
      }

      $scope.deviceId = null;
    });
  });
