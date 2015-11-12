// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tappt.services')
.factory("nfcService",
  ['$q', '$ionicPopup', '$state', 'Restangular', '$ionicPlatform',
  function ($q, $ionicPopup, $state, rest, $ionicPlatform) {
      var requestPour = false;
      var authenticating = false;
      var popup;

      var androidBeamNagCounter = 0;

      function getQueryVariable(query, variable) {
          var vars = query.split('&');
          for (var i = 0; i < vars.length; i++) {
              var pair = vars[i].split('=');
              if (decodeURIComponent(pair[0]) == variable) {
                  return decodeURIComponent(pair[1]);
              }
          }
      }

      function checkAndroidBeam() {
          return $q(function (resolve, reject) {
              if (window.WinJS !== undefined) {
                  resolve();
                  return;
              }

              nfc.beamEnabled(
                  function(isEnabled) {
                      if (!isEnabled || androidBeamNagCounter >= 2) {
                          resolve();
                          return;
                      }

                      if (popup) {
                          return;
                      }

                      androidBeamNagCounter++;

                      popup = $ionicPopup.show({
                        title: 'Please turn off Android Beam',
                        subTitle: 'Android Beam causes issues with Tappt.  Please turn it off for now.',
                        buttons: [
                            {
                                text: 'OK, Take Me There',
                                type: 'button-positive',
                                onTap: function(e) {
                                    nfc.openNfcSettings(true);
                                    reject();
                                }
                            },
                            {
                                text: 'Maybe Later',
                                onTap: function (e) {
                                    setTimeout(function() {
                                        resolve();
                                    }, 10);
                                }
                            },
                        ]
                      });

                      popup.then(function () {
                          popup = null;
                      });
                  },
                  function () {
                      if (popup) {
                          return;
                      }

                      androidBeamNagCounter = 0;

                      popup = $ionicPopup.show({
                          title: 'NFC is required',
                          subTitle: 'To pour any beer you need your NFC enabled.',
                          buttons: [
                              {
                                  text: 'OK, Take Me There',
                                  type: 'button-positive',
                                  onTap: function(e) {
                                      nfc.openNfcSettings(false);
                                      reject();
                                  }
                              },
                              {
                                  text: 'Maybe Later',
                                  onTap: function (e) {
                                      reject();
                                  }
                              },
                          ]
                      });
                      popup.then(function () {
                          popup = null;
                      });
                  }
              );
          });
      }

      $ionicPlatform.ready(function() {
          checkAndroidBeam();
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
                          nfc.removeTagDiscoveredListener(write);
                      }
                  }

                  if (window.cordova && window.cordova.platformId === 'android') {
                      nfc.addTagDiscoveredListener(write);
                  } else {
                      write();
                  }
              });
          },
          authenticatePour: function (deviceId) {
              if (authenticating) {
                  return;
              }

              authenticating = true;
              rest.all('api/authorizations/pour').post({ deviceId: deviceId }).then(function () {
                  authenticating = false;
                  popup.close();
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
                  $state.go('app.device-taps', { deviceId: deviceId });
              }

          },
          showPopup: function () {
              checkAndroidBeam().then(function() {
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
                              onTap: function() {
                                  requestPour = false;
                              },
                          },
                      ]
                  });
                  popup.then(function() {
                      requestPour = false;
                      popup = null;
                  });
              });
          }
      };

      return output;
  }]);
