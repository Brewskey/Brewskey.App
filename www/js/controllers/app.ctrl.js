angular.module('tappt.controllers', [])

.controller('AppCtrl', function($scope, auth, $ionicHistory, $state) {
	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.logout = function () {
		auth.logout();

		$ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go('app.login');
	};
});