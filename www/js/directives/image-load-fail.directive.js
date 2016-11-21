angular.module('brewskey.directives')
.directive('loadFail', [
'$parse',
function ($parse) {
    return {
        transclude: true,
        link: function (scope, element, attr) {
            var errorHandler = function (event) {
                element.off('error', errorHandler);
                var newSrc = attr.loadFail;

                var fn = $parse(newSrc);
                if (fn) {
                    scope.$apply(function () {
                        fn(scope, { $event: event });
                    });
                    return;
                }

                if (newSrc && element[0].src !== newSrc) {
                    element[0].src = newSrc;
                }
            };
            element.on('error', errorHandler);
        }
    };
}])
.directive('loaded', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var fn = $parse(attrs.loaded);
            elem.on('load', function (event) {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                });
            });
        }
    };
}]);
