angular.module('brewskey.controllers')
.controller('NearyLocationsCtrl', ['$scope', 'Restangular', 'nfcService', '$ionicPlatform',
function ($scope, rest, nfcService, $ionicPlatform) {
    $scope.loading = true;
    var coords = null;

    if (navigator.geolocation) {
        var onSuccess = function (position) {
            coords = position.coords;

            $scope.getNearbyLocations();
        };

        function onError(error) {
            $scope.loading = false;
            $scope.locationDisabled = true;
        }

        $ionicPlatform.ready(function () {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        });
    }

    $scope.getPercentLeft = function (keg) {
        return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
    };

    $scope.getNearbyLocations = function () {
        rest.one('api/locations/nearby').get({
            longitude: coords.longitude,
            latitude: coords.latitude,
            radius: -1,
        }).then(function (response) {
            $scope.locations = response;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.showPopup = function (deviceId) {
        $scope.$emit('device-id', deviceId);
        nfcService.showPopup();
    };
}]);
