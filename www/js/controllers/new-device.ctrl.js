angular.module('tappt')
.controller('NewDeviceCtrl', ['$scope', 'Restangular', '$stateParams', '$state',
function ($scope, rest, $stateParams, $state) {
    $scope.model = {
        id: $stateParams.deviceId,
        particleId: $stateParams.particleId,
    };
    $scope.deviceStatusTypes = [{ "value": 1, "text": "Active" }, { "value": 2, "text": "Disabled" }, { "value": 0, "text": "Unlocked" }];
    $scope.statusModel = $scope.deviceStatusTypes[0];
    if ($scope.model.id) {
        $scope.particleIdLoaded = true;
        $scope.particleIdValid = true;
        rest.one('api/devices', $stateParams.deviceId).get().then(function (response) {
            $scope.statusModel = _.find($scope.deviceStatusTypes, function (item) { return item.value === response.deviceStatus; });
            $scope.model = response;
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
        if (!$scope.form.$valid) {
            return;
        }
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
            $state.go('app.device', { deviceId: response.id }, { reload: true });
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
        }).catch(function () {
            $scope.particleIdLoaded = true;
            $scope.particleIdError = true;
        });
    };
    if ($scope.model.particleId) {
        $scope.getDeviceStatus();
    }
}]);
