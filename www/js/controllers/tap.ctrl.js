angular.module('brewskey.controllers').controller('TapCtrl', [
  '$scope',
  '$stateParams',
  'Restangular',
  'tapHub',
  'converter',
  'cache',
  'kegTypes',
  '$ionicHistory',
  'utils',
  'modal',
  '$ionicLoading',
  function(
    $scope,
    $stateParams,
    rest,
    tapHub,
    converter,
    cache,
    kegTypes,
    $ionicHistory,
    utils,
    modal,
    $ionicLoading
  ) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = false;
    });

    $scope.kegTypes = kegTypes;
    $scope.percentLeft = 0;
    function setupTap(response) {
      var currentKeg = response.currentKeg;
      $scope.$emit('device-id', response.deviceId);
      $scope.canEdit = (response.permissions || []).some(function(permission) {
        return (
          permission.permissionType === 0 || permission.permissionType === 1
        );
      });
      $scope.tap = response;

      if (!currentKeg) {
        $scope.loaded = true;
        return;
      }

      response.currentKeg.beverageId = response.currentKeg.beverage.id;

      $scope.percentLeft = utils.getPercentLeft(response.currentKeg);

      $scope.tap.kegs = _.filter($scope.tap.kegs, function(keg) {
        return keg.id !== $scope.tap.currentKeg.id;
      });

      if (response.currentKeg.beverage) {
        $scope.beverage = response.currentKeg.beverage;
        if ($scope.beverage.srm) {
          var srm = $scope.beverage.srm;
          $scope.beerColor = {
            color:
              srm.name === 'Over 40' || parseInt(srm.name, 10) > 9
                ? '#fff'
                : '',
            'background-color': '#' + $scope.beverage.srm.hex
          };
        }
        $scope.loaded = true;
      }

      $scope.kegId = response.currentKeg.id;
      $scope.kegLeaderboard = tapHub.getKegLeaderboard(
        response.id,
        $scope.kegId
      );
    }

    function setupPours(tapId) {
      $scope.getPours = tapHub.getPours(tapId);
      $scope.getKegPours = tapHub.getKegPours(tapId);
      $scope.leaderboard = tapHub.getLeaderboard(tapId);
    }

    $scope.normalize = converter.normalize;
    $scope.cacheBuster = cache.value;

    function getInfo() {
      if ($stateParams.deviceId) {
        return rest
          .one('api/devices', $stateParams.deviceId)
          .getList('taps')
          .then(
            function(response) {
              setupTap(response[0]);
              setupPours(response[0].id);
            },
            function(error) {
              $scope.loaded = true;
              $scope.hasError = true;
            }
          );
      } else {
        var promise = rest
          .one('api/taps', $stateParams.tapId)
          .get()
          .then(setupTap, function(error) {
            $scope.loaded = true;
            $scope.hasError = true;
          });

        if ($stateParams.tapId) {
          setupPours($stateParams.tapId);
        }

        return promise;
      }
    }

    getInfo();

    $scope.$on('tap-updated', function(scope, updatedTap) {
      $scope.tap = updatedTap;
    });
    $scope.$on('keg-updated', function(scope, updatedKeg) {
      $scope.tap.currentKeg = updatedKeg;
      setupTap($scope.tap);
    });

    $scope.refresh = function() {
      var tapId = $scope.tap.id;
      var kegId = $scope.kegId;
      tapHub.reload(
        ['pours', 'keg-pours', 'leaderboards', 'keg-leaderboards'],
        tapId,
        kegId
      );
      return getInfo().then(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.timeAgo = function(time) {
      return moment.utc(time).fromNow();
    };

    $scope.tabClicked = function() {
      $ionicHistory.currentView($ionicHistory.backView());
    };

    $scope.onPourHeld = function(pour) {
      modal
        .delete(
          'Pour',
          'api/pour/' + pour.id + '/',
          { name: 'this pour' },
          function() {
            $ionicLoading.show();
          }
        )
        .then(function() {
          return $scope.refresh();
        })
        .then(function() {
          $ionicLoading.hide();
        });
    };
  }
]);
