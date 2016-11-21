angular.module('brewskey.services')
    .factory('converter', ['Restangular',
    function (rest) {
        var converter = {
            normalize: function(ounces) {
                return Math.round(ounces) || 1;
            },
            translateToPints: function (ounces) {
                return converter.normalize(ounces) / 14;
            }
        };
        return converter;
    }]);
