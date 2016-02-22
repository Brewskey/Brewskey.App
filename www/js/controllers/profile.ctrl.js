angular.module('tappt.controllers')
.controller('ProfileCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', 'converter',
    function ($scope, rest, $stateParams, $storage, converter) {
    $scope.userName = $stateParams.userName || $storage.authDetails.userName;


    rest.one('api/profile', escape($scope.userName)).get().then(function (response) {
        response.totalPints = Math.round(converter.translateToPints(response.lifetimeTotal));
        $scope.profile = response;
    });

    $scope.translateToOunces = converter.translateToOunces;
}]);