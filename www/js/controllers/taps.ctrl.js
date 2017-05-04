<<<<<<< HEAD
angular.module('brewskey.controllers')
.controller('TapsCtrl', [
    '$scope', 'Restangular', 'modal',
    function($scope, rest, modal) {
        $scope.loading = true;
        rest.all('api/taps').getList().then(function(taps) {
            $scope.taps = taps;
        }).finally(function () { $scope.loading = false; });

        $scope.getPercentLeft = function (keg) {
            return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
        };

        $scope.deleteTap = function (tap) {
          modal.delete('Tap', 'api/taps', tap)
            .then(function (res) {
                if (!res) {
                    return;
                }

                $scope.taps = _.filter($scope.taps, function (t) {
                    return t !== tap;
                });
            });
        };
    }
]);
=======
angular.module('brewskey.controllers').controller('TapsCtrl', [
  '$scope',
  'Restangular',
  function($scope, rest) {
    $scope.loading = true;
    rest
      .all('api/taps')
      .getList()
      .then(function(taps) {
        $scope.taps = taps;
      })
      .finally(function() {
        $scope.loading = false;
      });

    $scope.getPercentLeft = function(keg) {
      return (keg.maxOunces - keg.ounces) / keg.maxOunces * 100;
    };
  },
]);
>>>>>>> 2773b5ddce7b41ac35feb246e97d991357e4b40d
