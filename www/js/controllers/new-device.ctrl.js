angular.module('brewskey')
.controller('NewDeviceCtrl', ['$scope', 'Restangular', '$stateParams', '$state', '$ionicPopup',
function ($scope, rest, $stateParams, $state, $ionicPopup) {
    $scope.model = {
        id: $stateParams.deviceId || undefined,
        particleId: $stateParams.particleId || undefined,
    };
    $scope.deviceStatusTypes = [
        { "value": 1, "text": "Active" },
        { "value": 2, "text": "Disabled" },
        { "value": 3, "text": "Cleaning" },
        { "value": 4, "text": "Open Valve" }
    ];
    $scope.statusModel = $scope.deviceStatusTypes[0];
    if ($scope.model.id) {
        $scope.particleIdLoaded = true;
        $scope.particleIdValid = true;
        rest.one('api/devices', $stateParams.deviceId).get().then(function (response) {
            $scope.statusModel = _.find($scope.deviceStatusTypes, function (item) { return item.value === response.deviceStatus; });
            $scope.model = response;
            $scope.isAdmin = (response.permissions || []).some(function (p) {
                return p.permissionType === 0;
            });
        });
    }
    $scope.editing = true;
    $scope.cancel = function () {
        if ($scope.model.id) {
            $state.go('^.details', { deviceId: $scope.model.id });
        }
        else {
            $state.go('^');
        }
    };

    $scope.submitForm = function () {
        if (navigator.connection && navigator.connection.type === Connection.NONE) {
            return;
        }

        if (!$scope.form.$valid) {
            return;
        }
        $scope.disabled = true;
        $scope.editing = false;
        var promise;
        $scope.model.deviceStatus = $scope.statusModel.value;
        if (!$scope.model.id) {
            promise = rest.all('api/devices').post($scope.model);
        }
        else {
            promise = $scope.model.put();
        }
        promise.then(function (response) {
            $state.go('app.device', { deviceId: response.id }, { location: 'replace' });
        }, function (error) {
            $scope.editing = true;
            if (!error.data) {
                return;
            }
            if (error.data.ModelState) {
                var errors = error.data.ModelState;
                $scope.errors = _.object(_.map(errors, function (value, key) { return key; }), _.map(errors, function (value) { return _.uniq(value); }));
            }
            if (error.data['error_description']) {
                $scope.errorDescription = error.data['error_description'];
            }
            if (error.data.Message) {
                $scope.errorDescription = error.data.Message;
            }
        }).finally(function () {
            $scope.disabled = false;
        });
    };
    $scope.getDeviceStatus = function () {
        $scope.particleIdLoaded = false;
        $scope.particleIdValid = false;
        $scope.particleIdInUse = false;
        $scope.particleIdError = false;
        if (!$scope.model.particleId) {
            return;
        }
        rest.one('api/devices/particle', $scope.model.particleId).one('status').get().then(function (response) {
            $scope.particleIdLoaded = true;
            $scope.particleIdValid = response.status === 0;
            $scope.particleIdInUse = response.status !== 0;
        }).catch(function (exception) {
            $scope.particleIdLoaded = true;
            $scope.particleIdError = true;
        });
    };
    if ($scope.model.particleId) {
        function onOffline() {
            document.removeEventListener("offline", onOffline);
            document.addEventListener("online", onOnline, false);
        }

        function onOnline() {
            document.removeEventListener("online", onOnline);
            $scope.getDeviceStatus();
        }

        document.addEventListener("offline", onOffline, false);
    }

    $scope.deleteDevice = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'green-popup',
            title: 'Delete ' + ($scope.model.name || 'Brewskey Box'),
            template: 'Are you sure you want to delete this Brewskey Box?'
        });

        confirmPopup.then(function (res) {
            if (!res) {
                return;
            }
            $scope.model.remove().then(function () {
                $state.go('app.devices');
            });
        });
    };
}]);
