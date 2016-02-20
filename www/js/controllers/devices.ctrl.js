angular.module('tappt')
    .controller('DevicesCtrl', [
    '$scope', 'Restangular',
    function ($scope, rest) {
        $scope.loading = true;
        rest.all('api/devices').getList().then(function (devices) {
            $scope.devices = devices;
            $scope.loading = false;
        }).catch(function () { return $scope.loading = false; });
    }
]);
