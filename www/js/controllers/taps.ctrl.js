angular.module('brewskey.controllers')
.controller('TapsCtrl', [
    '$scope', 'Restangular', function($scope, rest) {
        $scope.loading = true;
        rest.all('api/taps').getList().then(function(taps) {
            $scope.taps = taps;
        }).finally(function () { $scope.loading = false; });

        $scope.getPercentLeft = function (keg) {
            return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
        };
    }
]);