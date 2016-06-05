angular.module('brewskey.directives')
.directive('focusInput', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusInput);
            scope.$watch(model, function (value) {
                if (value !== true) {
                    return;
                }
                $timeout(function() {
                    element[0].focus();
                }, 10);
            });

            element.bind('blur', function () {
                scope.$apply(model && model.assign && model.assign(scope, false));
            });
        },
        scope: true,
    };
});