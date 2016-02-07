angular.module('tappt.controllers')
.controller('HomeCtrl', ['$scope', 'Restangular', 'converter', function($scope, rest, converter) {
    $scope.loading = true;
    rest.all('api/feed').getList().then(function (pourEvents) {
        $scope.pourEvents = pourEvents;
        $scope.loading = false;
    }).catch(function () { return $scope.loading = false; });
    $scope.translateToOunces = converter.translateToOunces;
}]);