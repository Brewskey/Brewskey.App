angular.module('tappt.services')
    .factory('converter', ['Restangular',
    function (rest) {
        var converter = {
            translateToOunces: function (pulses) {
                return Math.round(pulses / 10313 * 128) || 1;
            },
            translateToPints: function (pulses) {
                return converter.translateToOunces(pulses) / 14;
            }
        };
        return converter;
    }]);
