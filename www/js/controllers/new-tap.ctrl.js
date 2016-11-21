angular.module('brewskey.controllers')
.controller('NewTapCtrl',
['$scope', 'Restangular', '$stateParams', '$ionicHistory', '$state', '$ionicPopup', 'utils',
function ($scope, rest, $stateParams, $ionicHistory, $state, $ionicPopup, utils) {
    $scope.model = {
        deviceId: $stateParams.deviceId || undefined,
        locationId: $stateParams.locationId || undefined,
        id: $stateParams.tapId || undefined,
    };

    if ($scope.model.id) {
        rest.one('api/taps', $stateParams.tapId).get().then(function (response) {
            if (!response.flowSensorId) {
                $state.go('app.tap.set-sensor', { tapId: response.id }, { location: 'replace' });
                return;
            } else if (!response.currentKeg) {
                $state.go('app.tap.set-beverage', { tapId: response.id }, { location: 'replace' });
                return;
            }

            response.currentKeg.kegType += '';
            $scope.model = response;
            $scope.isAdmin = (response.permissions || []).some(function (p) {
                return p.permissionType === 0;
            });
            $scope.model.deviceId = $stateParams.deviceId || response.deviceId;
            $scope.model.locationId = $stateParams.locationId || response.locationId;
        });
    }

    rest.all('api/devices').getList().then(function (devices) {
        $scope.devices = devices;

        if (devices && devices.length === 1) {
            $scope.model.deviceId = devices[0].id;
        }
    });
    rest.all('api/locations').getList().then(function (locations) {
        $scope.locations = locations;

        if (locations && locations.length === 1) {
            $scope.model.locationId = locations[0].id;
        }
    });

    $scope.editing = false;

    $scope.submitForm = function (form) {
        $scope.editing = true;

        var promise;

        if (!$scope.model.id) {
            promise = rest.all('api/taps').post($scope.model);
        } else {
            promise = $scope.model.put();
        }

        promise.then(function (response) {
            $scope.editing = false;
            $scope.errors = null;

            form.$setPristine();
            $scope.$emit('tap-updated', response);

            if (!$scope.model.id) {
                $state.go('app.tap.set-sensor', { tapId: response.id }, { location: 'replace' });
            }
        }, function (error) {
            $scope.editing = false;
            
            $scope.errors = utils.filterErrors(error);
        });
    };

    $scope.deleteTap = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'green-popup',
            title: 'Delete ' + ($scope.model.name || 'tap'),
            template: 'Are you sure you want to delete this tap?'
        });

        confirmPopup.then(function (res) {
            $scope.editing = true;

            if (!res) {
                return;
            }
            $scope.model.remove().then(function () {
                $scope.editing = false;
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('app.taps');
            });
        });
    };

    $scope.updateSensor = function() {
        $state.go('app.tap.set-sensor', { tapId: $scope.model.id }, { location: 'replace' });
    };
}]);