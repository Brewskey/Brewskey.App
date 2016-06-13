angular.module('brewskey.controllers')
.controller('WifiCtrl', ['$scope', 'softAP', '$ionicPopup',
function ($scope, softAP, $ionicPopup) {
    $scope.state = 0;
    $scope.model = {};
    $scope.device = null;
    $scope.selectedNetwork = null;

    $scope.reset = function () {
        $scope.state = 0;
        runState();
    };

    $scope.nextState = function () {
        $scope.state++;
        runState();
    };

    $scope.previousState = function () {
        $scope.state--;
        runState();
    };

    $scope.selectNetwork = function (network) {
        $scope.selectedNetwork = network;
        $scope.model.password = '';
    };

    $scope.connect = function () {
        var network = $scope.selectedNetwork;
        softAP.configure({
            ssid: network.ssid,
            channel: network.ch,
            password: $scope.model.password,
            security: softAP.securityLookup(network.sec),
        }).then(function () {
            return softAP.connect();
        }).then(function (result) {
            $scope.nextState();
        }).catch(function (err) {
            $scope.nextState();
        });
    };

    function error() {
        $ionicPopup.alert({
            cssClass: 'alert-error green-popup',
            title: 'Wifi Setup Error',
            template: 'There was an error when attempting to setup the wifi on your device.  Please ' +
                'try resetting the device and if that fails, restart the Brewskey app.'
        }).then(function () {
            $scope.state = 0;
        });
    }

    function runState() {
        if ($scope.state === 1) {
            softAP.deviceReady().then(function (result) {
                $scope.device = result;
                $scope.nextState();
            }).catch(error);
        } else if ($scope.state === 2) {
            softAP.scan().then(function (result) {
                $scope.networks = result;
            }).catch(error);
            softAP.publicKey();
        } else if ($scope.state === 3) {

        }
    }
}]);
