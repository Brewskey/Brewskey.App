angular.module("brewskey.controllers").controller("DevicesCtrl", [
	"$scope",
	"Restangular",
	"modal",
	function($scope, rest, modal) {
		$scope.loading = true;

		var counter = 0;
		$scope.refresh = function() {
			rest
				.all("api/devices")
				.getList()
				.then(function(devices) {
					$scope.devices = devices;
				})
				.finally(function() {
					$scope.loading = false;
					$scope.$broadcast("scroll.refreshComplete");
				});
		};

		$scope.refresh();

		$scope.onDeviceHeld = function(device) {
			modal
				.delete("Brewskey Box", "api/devices", device)
				.then(function(result) {
					if (!result) {
						return;
					}
					$scope.devices = _.filter($scope.devices, function(d) {
						return d !== device;
					});
				});
		};
	}
]);
