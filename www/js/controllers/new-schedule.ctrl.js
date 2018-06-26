angular.module('brewskey.controllers').controller('NewScheduleCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$ionicHistory',
  'Restangular',
  '$ionicModal',
  'scheduleUtils',
  'utils',
  function(
    $scope,
    $state,
    $stateParams,
    $ionicHistory,
    rest,
    $ionicModal,
    scheduleUtils,
    utils
  ) {
    const DEFAULT_START_DATE = '1900-01-01T00:00:00.000Z';

    $scope.isLoaded = false;
    $scope.isDisabled = false;
    $scope.model = {
      accountIds: [],
      accounts: [],
      days: 0,
      endTime: moment
        .utc(DEFAULT_START_DATE)
        .endOf('day')
        .toDate(),
      id: $stateParams.scheduleId,
      locationId: $stateParams.locationId,
      name: 'No name',
      startTime: moment.utc(DEFAULT_START_DATE).toDate()
    };

    $scope.pageTitle = $scope.model.id ? 'Edit schedule' : 'New schedule';

    $scope.$watch('model.startTime', function(value) {
      $scope.formattedStartTime = moment.utc(value).format('hh:mm a');
    });

    $scope.$watch('model.endTime', function(value) {
      $scope.formattedEndTime = moment.utc(value).format('hh:mm a');
    });

    $scope.$watch('model.accounts', function(accounts) {
      $scope.model.accountIds = _.map(accounts, function(account) {
        return account.id;
      });
    });

    if ($scope.model.id) {
      rest
        .one('api/v2/schedules(' + $scope.model.id + ')')
        .get({
          $expand: 'accounts($select=id,email,userName),location($select=id)'
        })
        .then(function(response) {
          $scope.model = _.assign({}, response, {
            days: scheduleUtils.getCombinedFlag(response.days.split(', ')),
            locationId: response.location ? response.location.id : null
          });

          $scope.isLoaded = true;
        });
    } else {
      $scope.isLoaded = true;
    }

    $scope.submitForm = function() {
      $scope.isDisabled = true;

      var promise;

      if (!$scope.model.id) {
        promise = rest.all('api/v2/schedules').post($scope.model);
      } else {
        promise = rest
          .one('api/v2/schedules123123(' + $scope.model.id + ')')
          .customPUT($scope.model);
      }

      promise.then(
        function(response) {
          $scope.isDisabled = false;
          $scope.errors = null;
          $ionicHistory.currentView($ionicHistory.backView());
          $state.go(
            'app.schedule',
            { scheduleId: response.id },
            { location: 'replace' }
          );
        },
        function(error) {
          $scope.isDisabled = false;
          $scope.errors = utils.filterErrors(error);
          console.log($scope.errors);
        }
      );
    };
  }
]);
