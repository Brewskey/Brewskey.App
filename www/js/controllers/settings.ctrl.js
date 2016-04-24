angular.module('tappt.controllers')
.controller('SettingsCtrl', ['$scope', '$localStorage', function($scope, $localStorage) {
    $scope.settings = $localStorage.settings;
    $scope.settingChange = function() {
        $localStorage.settings = $scope.settings;
        $scope.$emit('settingChanged', $scope.settings);
    };
}]);