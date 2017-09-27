angular.module("brewskey.services").factory("gps", [
	"$ionicPlatform",
	"$q",
	function($ionicPlatform, $q) {
		var coords = null;
		var defer = $q.defer();
		if (navigator.geolocation) {
			var onSuccess = function(position) {
				coords = position.coords;
				defer.resolve(coords);
				defer = $q.defer();
			};

			function onError(error) {
				console.log(
					"code: " + error.code + "\n" + "message: " + error.message + "\n"
				);
				defer.reject();
				defer = $q.defer();
			}

			$ionicPlatform.ready(function() {
				navigator.geolocation.watchPosition(onSuccess, onError);
			});
		}

		return {
			getCoords: function() {
				return coords
					? $q(function(resolve) {
							resolve(coords);
						})
					: defer.promise;
			}
		};
	}
]);
