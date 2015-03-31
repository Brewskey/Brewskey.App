angular.module('tappt.controllers', [])

.controller('AppCtrl', function($scope, auth, $localStorage, $ionicHistory, $state) {
	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.settings = $localStorage.settings;

	$scope.logout = function () {
		auth.logout();

		$ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('app.login');
	};
});