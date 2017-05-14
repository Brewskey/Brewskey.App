angular.module('brewskey.controllers').controller('ScheduleCtrl', [
  '$scope',
  '$stateParams',
  'Restangular',
  function($scope, $stateParams, rest) {
    $scope.loading = true;
    rest
      .one('api/v2/schedules(' + $stateParams.scheduleId + ')')
      .get({
        $expand: 'accounts($select=email,id,userName)',
      })
      .then(function(response) {
        const schedule = _.assign({}, response, {         
          startTime: moment.utc(response.startTime).format('hh:mm a'),
          endTime: moment.utc(response.endTime).format('hh:mm a'),
        });

        $scope.schedule = schedule;
        $scope.loading = false;
      });
  },
]);
