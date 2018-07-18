angular.module('brewskey.controllers').controller('TapsCtrl', [
  '$scope',
  'Restangular',
  'modal',
  'utils',
  function($scope, rest, modal, utils) {
    utils.shouldShowStartPour = false;

    $scope.refresh = function() {
      $scope.loading = true;
      rest
        .all('api/taps')
        .getList()
        .then(function(taps) {
          $scope.taps = taps;
        })
        .finally(function() {
          $scope.loading = false;
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.refresh();

    $scope.getPercentLeft = utils.getPercentLeft;

    $scope.deleteTap = function(tap) {
      modal.delete('Tap', 'api/taps', tap).then(function(res) {
        if (!res) {
          return;
        }

        $scope.taps = _.filter($scope.taps, function(t) {
          return t !== tap;
        });
      });
    };
  }
]);
