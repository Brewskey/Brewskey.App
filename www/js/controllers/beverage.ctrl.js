angular.module('brewskey.controllers')
.controller('BeverageCtrl', ['$scope', 'Restangular', '$stateParams', function ($scope, rest, $stateParams) {
    $scope.loading = true;
    var beverageId = $stateParams.beverageId;
    var select = 'style,glass,availability,srm';
    rest.one('api/v2/beverages(' + beverageId + ')')
	        .get({'$expand': select})
	        .then(function (response) {
	            $scope.beverage = response;
	            $scope.loaded = true;
	        });
}]);