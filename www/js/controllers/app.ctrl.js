angular.module('tappt.controllers', [])

.controller('AppCtrl', function ($scope, auth, $localStorage, $ionicHistory, $state, nfcService) {
    $scope.isLoggedIn = auth.isLoggedIn;

    if ($localStorage.authDetails) {
        $scope.userName = $localStorage.authDetails.userName;
    }

    $scope.settings = $localStorage.settings;

    $scope.$on('settingChanged', function (event, settings) {
        $scope.settings = $localStorage.settings = settings;
    });
    $scope.$on('userChanged', function (event, account) {
        $localStorage.authDetails = account;
        $scope.userName = $localStorage.authDetails.userName;
    });

    $scope.logout = function () {
        auth.logout();

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $state.go('app.login');
    };

    $scope.showPopup = function () {
        nfcService.showPopup();
    };
});