angular.module('tappt.controllers')
    .controller('DevicesCtrl', [
    '$scope', 'Restangular',
    function ($scope, rest) {
        $scope.loading = true;

        $scope.refresh = function () {
            rest.all('api/devices').getList().then(function (devices) {
                $scope.devices = devices;
            }).finally(function () {
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.refresh();
    }
]);
