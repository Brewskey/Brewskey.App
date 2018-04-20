angular.module('brewskey.controllers').controller('BeveragesCtrl', [
  '$scope',
  'Restangular',
  '$localStorage',
  'modal',
  'utils',
  function($scope, rest, storage, modal, utils) {
    utils.shouldShowStartPour = false;
    $scope.loading = true;
    rest
      .one('api/v2/beverages')
      .get({ $filter: "createdBy/id eq '" + storage.authDetails.id + "'" })
      .then(function(odata) {
        $scope.beverages = odata.value;
      })
      .finally(function() {
        $scope.loading = false;
      });

    $scope.onBeverageHeld = function(beverage) {
      modal
        .delete(
          beverage.name,
          'api/v2/beverages(' + beverage.id + ')',
          beverage,
        )
        .then(function(result) {
          if (!result) {
            return;
          }
          $scope.beverages = _.filter($scope.beverages, function(b) {
            return b !== beverage;
          });
        });
    };
  },
]);
