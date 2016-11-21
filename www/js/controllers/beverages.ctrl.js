angular.module('brewskey.controllers')
.controller('BeveragesCtrl', ['$scope', 'Restangular', '$localStorage', function ($scope, rest, storage) {
    $scope.loading = true;
    rest.one('api/v2/beverages').get({ '$filter': 'createdBy/id eq \'' + storage.authDetails.id + '\'' }).then(function (odata) {
        $scope.beverages = odata.value;
    }).finally(function () {
        $scope.loading = false;
    });
}]);