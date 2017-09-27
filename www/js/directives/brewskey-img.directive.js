angular.module("brewskey.directives").directive("brewskeyImg", [
	function() {
		return {
			compile: function(element) {
				element.removeAttr("brewskey-img");
				element.removeAttr("height");
				element.removeAttr("width");

				return {
					post: function(scope, iElement, iAttrs) {
						scope.$watch("id", setUrl);
						iElement.css({ left: -9999999 });
						scope.loaded = false;
						var removeElement = function() {
							iElement.off("error", removeElement);
							iElement.remove();
							scope.loaded = false;
						};
						if (!iAttrs.loadFail) {
							iElement.on("error", removeElement);
						}
						if (!scope.id) {
							removeElement();
						}
						iElement.on("load", function() {
							scope.loaded = true;
							iElement.css({ left: "" });
						});

						function setUrl() {
							var url = "https://brewskey.com/cdn/";
							scope.hideImage = false;

							if (scope.type === "beverage") {
								url += "beverages/" + scope.id;

								switch (scope.size) {
									case "s":
										url += "-icon";
										break;
									case "m":
										url += "-medium";
										break;
									case "l":
										url += "-large";
										break;
									default:
										throw "Size must be set";
								}
							} else if (scope.type === "photo") {
								url += "photos/" + scope.id;
							} else {
								throw "Need to implement other image types";
							}

							url += ".jpg?";

							if (scope.width) {
								url += "w=" + scope.width;
							}
							if (scope.height) {
								url += "&h=" + scope.height;
							}

							url += "&mode=crop&trim.threshold=80&trim.percentpadding=0.5";

							if (scope.params) {
								url += "&" + scope.params;
							}

							iElement.attr("src", url);
						}

						setUrl();
					}
				};
			},
			restrict: "A",
			scope: {
				height: "@",
				id: "=id",
				loaded: "=?loaded",
				params: "@",
				size: "@",
				type: "@",
				width: "@"
			}
		};
	}
]);
