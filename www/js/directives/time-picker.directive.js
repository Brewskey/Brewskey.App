angular.module('brewskey.directives').directive('timePicker', [
  'scheduleUtils',
  '$ionicPopup',
  function(scheduleUtils, $ionicPopup) {
    return {
      link: function(scope) {
        scope.timeMoment = moment.utc(scope.time);
        scope.hours = 0;
        scope.minutes = 0;
        scope.affix = 'pm';
        scope.formattedTime = scope.timeMoment.format('hh: mm a');

        scope.$watch('maxTime', function(maxTime) {
          scope.maxTimeMoment = scope.maxTime
            ? moment.utc(scope.maxTime)
            : scope.timeMoment.clone().endOf('day');
        });

        scope.$watch('minTime', function(minTime) {
          scope.minTimeMoment = scope.minTime
            ? moment.utc(scope.minTime)
            : scope.timeMoment.clone().startOf('day');
        });

        scope.$watch('timeMoment', function(timeMoment) {
          scope.hours = scope.timeMoment.format('h');
          scope.minutes = scope.timeMoment.format('m');
          scope.affix = scope.timeMoment.format('a');
        });

        function addTime(additionNumber, timePeriod) {
          var resultMoment = scheduleUtils.getBoundedMoment(
            scope.timeMoment.clone().add(additionNumber, timePeriod),
            scope.minTimeMoment,
            scope.maxTimeMoment
          );

          scope.timeMoment = resultMoment;
        }

        scope.addHours = function(hours) {
          addTime(hours, 'hours');
        };

        scope.addMinutes = function(minutes) {
          addTime(minutes, 'minutes');
        };

        scope.changeAffix = function(affix) {
          if (affix === scope.timeMoment.format('a')) {
            return;
          }

          if (affix == 'pm') {
            scope.addHours(12);
          } else {
            scope.addHours(-12);
          }
        };

        scope.showPopup = function() {
          scope.timeMoment = moment.utc(scope.time);

          $ionicPopup.show({
            templateUrl: '/templates/popups/time-picker.html',
            scope: scope,
            cssClass: 'time-picker',
            buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Set</b>',
                type: 'button-positive',
                onTap: function() {
                  scope.time = scope.timeMoment.toDate();
                  scope.formattedTime = scope.timeMoment.format('hh: mm a');
                },
              },
            ],
          });
        };
      },
      restrict: 'E',
      scope: {
        isDisabled: '<',
        maxTime: '<',
        minTime: '<',
        time: '=',
      },
      templateUrl: 'templates/directives/time-picker.html',
    };
  },
]);
