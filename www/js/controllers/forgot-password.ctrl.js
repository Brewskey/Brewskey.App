angular.module("brewskey.controllers").controller("ForgotPasswordCtrl", [
	"$scope",
	"auth",
	"$ionicHistory",
	"$state",
	"utils",
	"$ionicPopup",
	function($scope, auth, $ionicHistory, $state, utils, $ionicPopup) {
		// Form data for the reset password
		$scope.sending = false;
		$scope.model = {};

		// Perform the login action when the user submits the login form
		$scope.forgotPassword = function() {
			$scope.sending = true;

			auth.forgotPassword($scope.model).then(
				function(response) {
					$ionicPopup.alert({
						cssClass: "green-popup",
						title: "Email sent!",
						template:
							"We've sent an email to the address you provided with instructions on how to reset your password."
					});

					$state.go("app.home");
				},
				function(error) {
					$scope.sending = false;

					$scope.errors = utils.filterErrors(error);
				}
			);
		};
	}
]);
