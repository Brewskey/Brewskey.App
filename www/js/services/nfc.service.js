var appActivated;
var deferred;
angular.injector(["ng"]).invoke([
	"$q",
	function($q) {
		deferred = $q.defer();
	}
]);
if (window.WinJS !== undefined) {
	WinJS.Application.addEventListener(
		"activated",
		function(eventArgs) {
			if (
				eventArgs.detail.kind ==
				Windows.ApplicationModel.Activation.ActivationKind.protocol
			) {
				deferred.promise.then(function() {
					appActivated(eventArgs);
				});
			}
		},
		false
	);
}

angular.module("brewskey.services").factory("nfcService", [
	"$rootScope",
	"$q",
	"$ionicPopup",
	"$state",
	"Restangular",
	"$ionicPlatform",
	"$timeout",
	"$ionicLoading",
	"$ionicHistory",
	"$interval",
	"gps",
	function(
		$rootScope,
		$q,
		$ionicPopup,
		$state,
		rest,
		$ionicPlatform,
		$timeout,
		$ionicLoading,
		$ionicHistory,
		$interval,
		gps
	) {
		var requestPour = false;
		var authenticating = false;
		var popup;
		var currentDeviceId;

		$rootScope.$on("device-id", function(event, value) {
			currentDeviceId = value;
		});
		$rootScope.$on("$stateChangeSuccess", function(event, toState) {
			if (toState.name.indexOf("app.tap.") === 0) {
				return;
			}

			currentDeviceId = null;
		});

		function checkNfc() {
			return $q(function(resolve) {
				if (typeof nfc === "undefined") {
					resolve();
					return;
				}

				nfc.enabled(resolve, nfcError);
			});
		}

		function nfcError(e) {
			if (popup) {
				return;
			}

			popup = $ionicPopup.show({
				cssClass: "green-popup",
				title: "NFC is required",
				subTitle: "To pour any beer you need your NFC enabled.",
				buttons: [
					{
						text: "OK, Take Me There",
						type: "button-positive",
						onTap: function(e) {
							nfc.showSettings();
						}
					},
					{
						text: "Maybe Later",
						onTap: function(e) {}
					}
				]
			});
			popup.then(function() {
				popup = null;
			});
		}

		$ionicPlatform.ready(function() {
			if (window.cordova && window.cordova.platformId === "windows") {
				appActivated = function(eventArgs) {
					output.processUri(eventArgs.detail.uri.rawUri);
				};
				deferred.resolve();
			}

			if (typeof nfc !== "undefined") {
				$timeout(function() {
					nfc.addNdefListener(
						function(nfcEvent) {
							var payload;
							if (nfcEvent.tag.ndefMessage) {
								payload = nfcEvent.tag.ndefMessage[1].payload;
							} else {
								if (!nfcEvent.tag[1].payload[0]) {
									nfcEvent.tag[1].payload.shift();
								}

								payload = nfcEvent.tag[1].payload;
							}

							var tagValue = String.fromCharCode.apply(
								null,
								payload[0] === 0 ? payload.slice(1) : payload
							);

							if (tagValue.indexOf("https://brewskey.com/") < 0) {
								return;
							}

							output.processUri(tagValue);
						},
						function() {
							console.log("Listening for NDEF tags.");
						},
						nfcError
					);
				}, 20);
			}
		});

		var scope;

		var output = {
			writeTag: function(authKey) {
				var message = [ndef.textRecord(authKey)];

				return $q(function(resolve, reject) {
					function write() {
						nfc.write(message, resolve, reject);
						if (window.cordova && window.cordova.platformId === "android") {
							nfc.removeTagDiscoveredListener(write, nfcError);
						}
					}

					if (window.cordova && window.cordova.platformId === "android") {
						nfc.addTagDiscoveredListener(write, nfcError);
					} else {
						write();
					}
				});
			},
			authenticatePour: function(deviceId, coordinates, totp) {
				if (authenticating) {
					return;
				}

				authenticating = true;

				popup.close();
				if (totp) {
					$ionicLoading.show();
				}

				rest
					.all("api/authorizations/pour")
					.post({
						deviceId: deviceId || undefined,
						latitude: coordinates.latitude,
						longitude: coordinates.longitude,
						totp: totp
					})
					.then(
						function() {
							authenticating = false;
							if (totp) {
								$ionicLoading.hide();
								popup && popup.close();
							}
						},
						function(e) {
							authenticating = false;

							if (totp) {
								$ionicLoading.hide();
								$ionicPopup.alert({
									cssClass: "green-popup",
									title: "Invalid passcode",
									template:
										"The passcode you entered was incorrect or expired.  Please try a new code."
								});
							}
						}
					);
			},
			processUri: function(rawUri) {
				var index = rawUri.indexOf("d/");

				if (index >= 0) {
					var deviceId = rawUri.substring(index).match(/\d+/)[0];

					if (!deviceId) {
						return;
					}

					if (requestPour) {
						gps.getCoords().then(function(coordinates) {
							output.authenticatePour(deviceId, coordinates);
						});
						return;
					}

					// navigate
					rest
						.one("api/devices", deviceId)
						.getList("taps")
						.then(function(response) {
							$ionicHistory.currentView($ionicHistory.backView());
							$state.go(
								"app.tap.leaderboard",
								{ tapId: response[0].id },
								{ location: "replace" }
							);
						});
				}
			},
			showPopup: function() {
				return checkNfc()
					.then(function() {
						return gps.getCoords();
					})
					.then(function(coordinates) {
						if (popup) {
							return;
						}

						scope = $rootScope.$new(true);
						scope.submitTotp = function() {
							output.authenticatePour(currentDeviceId, coordinates, scope.totp);
						};

						scope.isDisabled = function() {
							return !scope.totp || scope.totp.toString().length !== 6;
						};

						scope.checkTotp = function($event) {
							scope.totp = $event.target.value;
						};

						// Show 30 second interval timer
						var RADIUS = 36;
						var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
						var animationElement = $(".totp-timer__value");
						scope.init = function() {
							animationElement = $(".totp-timer__value");
							animationElement.css({ strokeDasharray: CIRCUMFERENCE });
						};

						function setSeconds() {
							scope.currentSeconds = 30 - new Date().getSeconds() % 30;
						}
						setSeconds();
						$interval(setSeconds, 1000);

						var animationID,
							startSeconds = scope.currentSeconds,
							startTime = performance.now();

						function animate(delta) {
							var deltaSeconds = ((delta - startTime) / 1000) % 30;
							var progress = ((deltaSeconds - startSeconds) % 30) / 30;
							var dashoffset = CIRCUMFERENCE * progress;

							animationElement &&
								animationElement.css({ strokeDashoffset: dashoffset });
							animationID = requestAnimationFrame(animate);
						}
						animationID = requestAnimationFrame(animate);

						var subTitle = null;
						if (ionic.Platform.isIOS()) {
							subTitle =
								"Enter the 6 digit code on the Brewskey Box to begin pouring";
						} else if (currentDeviceId) {
							subTitle =
								"Place your phone on the Brewskey box or enter the 6 digit code on the Brewskey Box to begin pouring";
						} else {
							subTitle =
								"Place your phone on the Brewskey box to begin pouring";
						}

						requestPour = true;
						popup = $ionicPopup.show({
							cssClass: "green-popup",
							title: "Tap phone to pour beer",
							subTitle: subTitle,
							templateUrl: "templates/modals/totp.html",
							scope: scope,
							buttons: [
								{
									text: "Cancel",
									onTap: function() {
										requestPour = false;
									}
								}
							]
						});
						return popup.then(function() {
							requestPour = false;
							popup = null;
							cancelAnimationFrame(animationID);
						});
					});
			}
		};

		return output;
	}
]);
