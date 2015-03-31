angular.module('tappt.controllers')
.controller('SettingsCtrl', ['$scope', '$localStorage', function($scope, $localStorage) {
  $scope.settings = $localStorage.settings;
}]);