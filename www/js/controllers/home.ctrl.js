angular.module('tappt.controllers')
.controller('HomeCtrl', ['$scope', '$localStorage', '$state', function($scope, storage, $state) {
    $state.go('app.tap', {tapId: 2});
}]);