angular.module('brewskey.controllers').controller('KegCtrl', [
  '$scope',
  '$stateParams',
  'Restangular',
  function($scope, $stateParams, rest) {
    rest
      .one('api/kegs', $stateParams.kegId)
      .get()
      .then(function(response) {
        $scope.tap = response;
        $scope.canEdit = (response.permissions || []).some(function(
          permission
        ) {
          // Admin or edit permissions
          return (
            permission.permissionType === 0 || permission.permissionType === 1
          );
        });
      });
  }
]);
