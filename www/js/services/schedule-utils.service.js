angular.module('brewskey.services').factory('scheduleUtils', [
  function() {
    var SCHEDULE_DAY_BIT_MAP = {
      All: 127,
      Friday: 16,
      Monday: 1,
      None: 0,
      Saturday: 32,
      Sunday: 64,
      Thursday: 8,
      Tuesday: 2,
      Wednesday: 4,
      WeekDays: 31,
    };

    var DAYS = _.range(7).map(function(_, index) {
      var name = moment(index, 'e').format('dddd');
      return {
        name,
        shortLabel: moment(index, 'e').format('ddd'),
      };
    });

    function getBoundedMoment(valueMoment, minMoment, maxMoment) {
      return moment.max(minMoment, moment.min(valueMoment, maxMoment));
    }

    return {
      DAYS,
      getBoundedMoment,
      getCombinedFlag: function(days) {
        return days.reduce(
          (total, day) => total | SCHEDULE_DAY_BIT_MAP[day],
          0
        );
      },
      // return true if scheduleDay === (dayName || All) for any day,
      // or scheduleDay === (dayName || All || weekDays ) for weekdays
      isDaySelected: function(scheduleDaysFlag, dayName) {
        return !!(SCHEDULE_DAY_BIT_MAP[dayName] & scheduleDaysFlag);
      },
      SCHEDULE_DAY_BIT_MAP,
    };
  },
]);
