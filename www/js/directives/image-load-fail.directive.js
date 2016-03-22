angular.module('tappt.directives')
.directive('loadFail', [
function () {
    return {
        link: function (scope, element, attr) {
            var errorHandler = function () {
                element.off('error', errorHandler);
                var newSrc = attr.loadFail;
                if (element[0].src !== newSrc) {
                    element[0].src = newSrc;
                }
            };
            element.on('error', errorHandler);
        }
    };
}]);
