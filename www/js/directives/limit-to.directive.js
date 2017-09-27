angular.module("brewskey.directives").directive("limitTo", [
	function() {
		return {
			restrict: "A",
			link: function(scope, elem, attrs) {
				var limit = parseInt(attrs.limitTo);
				angular.element(elem).on("keypress", function(e) {
					if (this.value.length == limit) e.preventDefault();
				});
			}
		};
	}
]);
