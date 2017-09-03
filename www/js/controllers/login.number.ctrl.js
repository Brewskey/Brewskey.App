angular.module("brewskey.controllers").controller("LoginNumberCtrl", [
	"$scope",
	"auth",
	"$ionicHistory",
	"$state",
	"utils",
	function($scope, auth, $ionicHistory, $state, utils) {
		// Form data for the login modal
		$scope.loggingIn = false;
		$scope.loginData = {};
		$scope.showTotp = false;

		$scope.sendTotp = function() {
			auth.sendTotp($scope.phoneNumber).then(
				function(response) {},
				function(error) {
					$scope.errors = utils.filterErrors(error);
				}
			);
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function(modal) {
			$scope.loggingIn = true;

			auth.login($scope.loginData).then(
				function(response) {
					$scope.loggingIn = false;
					$scope.loginData = {};

					$ionicHistory.nextViewOptions({
						historyRoot: true
					});

					if (modal) {
						modal.hide();
					} else {
						$state.go("app.home");
					}
				},
				function(error) {
					$scope.loggingIn = false;
					$scope.errors = utils.filterErrors(error);
				}
			);
		};
	}
]);
