angular.module('tappt.controllers')
.controller('SettingsCtrl', ['$scope', '$localStorage', function($scope, storage) {
  $scope.settings = storage.settings;

  if (!$scope.settings) {
    $scope.settings = storage.settings = {
      pushNotifications: true,
      manageLocations: false
    };
  }
}]);