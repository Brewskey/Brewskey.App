angular.module('brewskey.controllers')
    .controller('DeviceCtrl', [
    '$scope', 'Restangular', '$stateParams', '$state',
    function ($scope, rest, $stateParams, $state) {
        $scope.loading = true;
        rest.one('api/devices', $stateParams.deviceId).get().then(function (response) {
            $scope.loading = false;
            $scope.device = response;
        });
        rest.one('api/devices', $stateParams.deviceId).one('taps').get().then(function (response) {
            $scope.taps = response;
        });
        rest.one('api/devices', $stateParams.deviceId).one('status').get().then(function (response) {
            $scope.particleStatus = response.particleStatus;
        });
        $scope.delete = function () {
            $scope.device.remove().then(function () {
                setTimeout(function () {
                    $state.go('^', null, { reload: true });
                }, 500);
            });
        };
        $scope.resetToken = function () {
            rest.one('api/devices', $stateParams.deviceId).one('reset-token').get().then(function (response) {
                $scope.device.clientSecret = response.clientSecret;
            });
        };
    }
]);
