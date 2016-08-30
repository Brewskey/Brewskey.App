angular.module('brewskey.controllers')
.controller('ProfileEditCtrl', ['$scope', 'auth', '$localStorage', 'utils',
function ($scope, auth, storage, utils) {
    $scope.model = angular.copy(storage.authDetails);
    $scope.sending = false;

    $scope.submit = function () {
        $scope.errors = null;
        $scope.sending = true;
        var oldNumber = $scope.model.phoneNumber;
        auth.updateAccount($scope.model).then(function(a) {
            if (storage.authDetails.phoneNumber !== oldNumber) {
                $scope.enterToken = true;
            } else if (storage.authDetails.phoneNumber) {
                // go to profile
            }
        }, function(error) {
            $scope.errors = utils.filterErrors(error);
        })
        .finally(function () {
            $scope.sending = false;
        });
    };
    $scope.sendToken = function() {
        $scope.sending = true;
        $scope.errors = null;
        auth.sendPhoneToken($scope.model)
            .then(function(e) {
                // go to profile
            }, function (error) {
                $scope.errors = utils.filterErrors(error);
            })
            .finally(function () {
                $scope.sending = false;
            });
    };

    $scope.toggleForms = function () {
        $scope.errors = null;
        $scope.enterToken = !$scope.enterToken;
    };
}]);