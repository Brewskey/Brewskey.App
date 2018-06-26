angular.module('brewskey.directives').directive('daysPicker', [
  'scheduleUtils',
  function(scheduleUtils) {
    return {
      link: function(scope) {
        scope.days = scheduleUtils.DAYS;

        scope.$watch('daysCombinedFlag', function(daysCombinedFlag) {
          scope.selectedDaysMap = _.chain(scheduleUtils.DAYS)
            .filter(function(day) {
              return scheduleUtils.isDaySelected(daysCombinedFlag, day.name);
            })
            .keyBy('name')
            .value();
        });

        scope.toggleDay = function(day) {
          scope.daysCombinedFlag =
            scope.daysCombinedFlag ^
            scheduleUtils.SCHEDULE_DAY_BIT_MAP[day.name];
        };
      },
      restrict: 'E',
      scope: {
        daysCombinedFlag: '=',
        isDisabled: '<'
      },
      templateUrl: 'templates/directives/days-picker.html'
    };
  }
]);
