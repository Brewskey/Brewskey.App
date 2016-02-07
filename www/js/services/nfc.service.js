var appActivated;
var deferred;
angular.injector(['ng']).invoke([
    '$q', function ($q) {
        deferred = $q.defer();
    }
]);
if (window.WinJS !== undefined) {
    WinJS.Application.addEventListener("activated", function (eventArgs) {
        if (eventArgs.detail.kind == Windows.ApplicationModel.Activation.ActivationKind.protocol) {
            deferred.promise.then(function () {
                appActivated(eventArgs);
            });
        }
    }, false);
}

angular.module('tappt.services')
.factory("nfcService",
  ['$q', '$ionicPopup', '$state', 'Restangular', '$ionicPlatform', '$timeout',
  function ($q, $ionicPopup, $state, rest, $ionicPlatform, $timeout) {
      var requestPour = false;
      var authenticating = false;
      var popup;

      function checkNfc() {
          return $q(function (resolve) {
              nfc.enabled(resolve, nfcError);
          });
      }

      function nfcError(e) {
          if (popup) {
              return;
          }

          popup = $ionicPopup.show({
              title: 'NFC is required',
              subTitle: 'To pour any beer you need your NFC enabled.',
              buttons: [
                  {
                      text: 'OK, Take Me There',
                      type: 'button-positive',
                      onTap: function (e) {
                          nfc.showSettings();
                      }
                  },
                  {
                      text: 'Maybe Later',
                      onTap: function (e) {
                      }
                  },
              ]
          });
          popup.then(function () {
              popup = null;
          });
      }

      $ionicPlatform.ready(function () {
          if (window.cordova && window.cordova.platformId === 'windows') {
              appActivated = function (eventArgs) {
                  output.processUri(eventArgs.detail.uri.rawUri);
              };
              deferred.resolve();
          }

          if (typeof nfc !== 'undefined') {
              $timeout(function () {
                  nfc.addNdefListener(
                      function (nfcEvent) {
                          var payload;
                          if (nfcEvent.tag.ndefMessage) {
                              payload = nfcEvent.tag.ndefMessage[1].payload;
                          } else {
                              if (!nfcEvent.tag[1].payload[0]) {
                                  nfcEvent.tag[1].payload.shift();
                              }

                              payload = nfcEvent.tag[1].payload;
                          }

                          var tagValue = String.fromCharCode.apply(null, payload);

                          if (tagValue.indexOf('https://tappt.io/') < 0) {
                              return;
                          }

                          output.processUri(tagValue);
                      },
                      function () {
                          console.log("Listening for NDEF tags.");
                      },
                      nfcError
                  );
              }, 20);

          }
      });

      var output = {
          writeTag: function (authKey) {
              var message = [
                ndef.textRecord(authKey)
              ];

              return $q(function (resolve, reject) {
                  function write() {
                      nfc.write(message, resolve, reject);
                      if (window.cordova && window.cordova.platformId === 'android') {
                          nfc.removeTagDiscoveredListener(write, nfcError);
                      }
                  }

                  if (window.cordova && window.cordova.platformId === 'android') {
                      nfc.addTagDiscoveredListener(write, nfcError);
                  } else {
                      write();
                  }
              });
          },
          authenticatePour: function (deviceId) {
              if (authenticating || !deviceId) {
                  return;
              }

              authenticating = true;
              popup.close();
              rest.all('api/authorizations/pour').post({ deviceId: deviceId }).then(function () {
                  authenticating = false;
              }, function (e) {
                  authenticating = false;
              });
          },
          processUri: function (rawUri) {
              var index = rawUri.indexOf('d/');

              if (index >= 0) {
                  var deviceId = rawUri.substring(index).match(/\d+/)[0];

                  if (!deviceId) {
                      return;
                  }

                  if (requestPour) {
                      output.authenticatePour(deviceId);
                      return;
                  }

                  // navigate
                  rest.one('api/devices', deviceId).getList('taps').then(function (response) {
                      $state.go('app.tap.leaderboard', { tapId: response[0].id });
                  });
              }

          },
          showPopup: function () {
              checkNfc().then(function () {
                  if (popup) {
                      return;
                  }

                  requestPour = true;
                  popup = $ionicPopup.show({
                      title: 'Tap phone to pour beer',
                      subTitle: 'Place your phone on the Tappt box to begin pouring.',
                      buttons: [
                          {
                              text: 'Cancel',
                              onTap: function () {
                                  requestPour = false;
                              },
                          },
                      ]
                  });
                  popup.then(function () {
                      requestPour = false;
                      popup = null;
                  });
              });
          }
      };

      return output;
  }]);
