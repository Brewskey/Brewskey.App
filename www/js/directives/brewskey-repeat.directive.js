angular.module("brewskey.directives").directive("brewskeyRepeat", [
	"$compile",
	function($compile) {
		return {
			restrict: "A",
			priority: 1001,
			terminal: true,
			compile: function(el, $attrs) {
				var repeatAttr = "ng-repeat";
				if (!ionic.Platform.noScroll()) {
					repeatAttr = "collection-repeat";
				}
				el.attr(repeatAttr, $attrs.brewskeyRepeat);
				el.removeAttr("brewskey-repeat");
				var fn = $compile(el);
				return function(scope) {
					fn(scope);
				};
			}
		};
	}
]);
