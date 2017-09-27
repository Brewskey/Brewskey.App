angular.module("brewskey.controllers").controller("BeverageCtrl", [
	"$scope",
	"Restangular",
	"$stateParams",
	function($scope, rest, $stateParams) {
		$scope.loading = true;
		$scope.beverage = {};
		var beverageId = $stateParams.beverageId;
		var select = "style,glass,availability,srm";
		rest
			.one("api/v2/beverages(" + beverageId + ")")
			.get({ $expand: select })
			.then(function(response) {
				$scope.beverage = response;
				$scope.loaded = true;

				if ($scope.beverage.srm) {
					var srm = $scope.beverage.srm;
					$scope.beerColor = {
						color:
							srm.name === "Over 40" || parseInt(srm.name, 10) > 9
								? "#fff"
								: "",
						"background-color": "#" + $scope.beverage.srm.hex
					};
				}
			});
	}
]);
