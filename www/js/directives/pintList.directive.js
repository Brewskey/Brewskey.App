angular.module('brewskey.directives', [])
    .directive('pintList', [
    'converter',
    function (converter) {
        return {
            link: function (scope, element) {
                function update() {
                    var count = converter.translateToPints(scope.count || 0);
                    scope.wholePints = Array(Math.floor(count));
                    scope.partialPintHeight = count % 1 * 100;
                    scope.leftoverOunces = Math.round(count % 1 * 14);
                }
                scope.$watch('count', update);
            },
            restrict: 'E',
            scope: {
                count: '=',
            },
            templateUrl: 'templates/pint-list.html',
        };
    }]);
