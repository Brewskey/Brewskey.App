angular.module('tappt.directives')
.directive('loadFail', [
function () {
    return {
        link: function (scope, iElement, attrs) {
            iElement.bind('error', function () {
                angular.element(this).attr("src", attrs.loadFail);
                iElement.unbind('error');
            });
        }
    };
}]);
