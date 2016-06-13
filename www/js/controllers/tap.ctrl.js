angular.module('brewskey.controllers')
.controller('TapCtrl', ['$scope', '$stateParams', 'Restangular', 'tapHub', 'converter', 'cache', 'kegTypes',
    function ($scope, $stateParams, rest, tapHub, converter, cache, kegTypes) {
        $scope.kegTypes = kegTypes;
        $scope.percentLeft = 0;
        function setupTap(response) {
            var currentKeg = response.currentKeg;

            $scope.percentLeft = (currentKeg.maxOunces - currentKeg.ounces) / currentKeg.maxOunces * 100;

            $scope.$emit('device-id', response.deviceId);
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

        function setupPours(tapId) {
            $scope.getPours = tapHub.getPours(tapId);
            $scope.getKegPours = tapHub.getKegPours(tapId);
            $scope.leaderboard = tapHub.getLeaderboard(tapId);
        }

        $scope.normalize = converter.normalize;
        $scope.cacheBuster = cache.value;

        function getInfo() {
            if ($stateParams.deviceId) {
                rest.one('api/devices', $stateParams.deviceId).getList('taps').then(function (response) {
                    setupTap(response[0]);
                    setupPours(response[0].id);
                });
            } else {
                rest.one('api/taps', $stateParams.tapId).get().then(setupTap);

                if ($stateParams.tapId) {
                    setupPours($stateParams.tapId);
                }
            }
        }

        getInfo();

        $scope.refresh = function () {
            var tapId = $scope.tap.id;
            var kegId = $scope.kegId;
            tapHub.reload(['pours', 'keg-pours', 'leaderboards', 'keg-leaderboards'], tapId, kegId);
            getInfo();

            $scope.$broadcast('scroll.refreshComplete');
        };
    }]);