angular.module('brewskey.controllers').controller('SchedulesCtrl', [
  '$scope',
  '$stateParams',
  'Restangular',
  function($scope, $stateParams, rest) {
    $scope.loading = true;
    rest
      .one('api/v2/schedules')
      .get({ $filter: 'location/id eq ' + $stateParams.locationId })
      .then(function(response) {
        $scope.schedules = response.value.map(function(schedule) {
          return _.assign({}, schedule, {
            startTime: moment(schedule.startTime).format('hh:mm a'),
            endTime: moment(schedule.stopTime).format('hh:mm a'),
          });
        });
        $scope.loading = false;
      });
  },
]);
