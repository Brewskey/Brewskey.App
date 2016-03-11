angular.module('tappt.controllers')
.controller('TapCtrl', ['$scope', '$stateParams', 'Restangular', 'tapHub', 'converter', 'cache',
    function ($scope, $stateParams, rest, tapHub, converter, cache) {
    function setupTap(response) {
        $scope.tap = response;
        $scope.canEdit = response.permissions && _.filter(response.permissions, function (permission) {
            return permission.permissionType === 4;
        }).length;

        $scope.tap.kegs = _.filter($scope.tap.kegs, function (keg) {
            return keg.id !== $scope.tap.currentKeg.id;
        });

        rest.one('api/beer/', response.currentKeg.beerId).get().then(function (response) {
            $scope.beer = response.data;
        });
        $scope.kegId = response.currentKeg.id;
        $scope.kegLeaderboard = tapHub.getKegLeaderboard(response.id, $scope.kegId);
    }

    if ($stateParams.deviceId) {
        rest.one('api/devices', $stateParams.deviceId).getList('taps').then(function (response) {
            setupTap(response[0]);
            setupPours(response[0].id);
        });
    } else {
        rest.one('api/taps', $stateParams.tapId).get().then(setupTap);
    }
    
    function setupPours(tapId) {
        $scope.getPours = function () { return tapHub.getPours(tapId); };
        $scope.getKegPours = function () { return tapHub.getKegPours(tapId); };
        $scope.leaderboard = tapHub.getLeaderboard(tapId);
    }

    if ($stateParams.tapId) {
        setupPours($stateParams.tapId);
    }

    $scope.translateToOunces = converter.translateToOunces;
    $scope.cacheBuster = cache.value;
}]);