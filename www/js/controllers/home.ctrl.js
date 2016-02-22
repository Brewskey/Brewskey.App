angular.module('tappt.controllers')
.controller('HomeCtrl', ['$scope', 'Restangular', 'converter', '$localStorage', function($scope, rest, converter, $storage) {
    $scope.loading = true;
    $scope.refresh = function() {
        rest.all('api/feed').getList()
            .then(function (pourEvents) {
                $scope.pourEvents = pourEvents;
            })
            .finally(function() {
                $scope.loading = false;
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
    $scope.refresh();

    $scope.translateToOunces = converter.translateToOunces;

    $scope.renderUserName = function(userName) {
        return userName === $storage.authDetails.userName ? "You" : userName;
    };
}]);