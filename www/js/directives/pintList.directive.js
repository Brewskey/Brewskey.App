angular.module('tappt.directives', [])
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
            template: '<div class="pint-glass" ng-repeat="i in wholePints track by $index" title="14 ounces">' +
                '<div class="beer"></div>' +
                '<div class="pint"></div>' +
                '</div>' +
                '<div class="pint-glass" ng-if="partialPintHeight > 0" title="{{leftoverOunces}} ounces">' +
                '<div class="beer" ng-style="{height: partialPintHeight + \'%\'}"></div>' +
                '<div class="pint"></div>' +
                '</div>',
        };
    }]);
