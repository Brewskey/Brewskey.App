// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tappt.services')
.factory("nfcService",
  ['$q', '$ionicPopup', '$state', 'Restangular',
  function ($q, $ionicPopup, $state, rest) {
      var requestPour = false;
      var authenticating = false;
      var popup;

      function getQueryVariable(query, variable) {
          var vars = query.split('&');
          for (var i = 0; i < vars.length; i++) {
              var pair = vars[i].split('=');
              if (decodeURIComponent(pair[0]) == variable) {
                  return decodeURIComponent(pair[1]);
              }
          }
      }

      var output = {
          writeTag: function (authKey) {
              var message = [
                ndef.textRecord(authKey)
              ];

              return $q(function (resolve, reject) {
                  nfc.write(message, resolve, reject);
              });
          },
          authenticatePour: function (deviceId) {
              if (authenticating) {
                  return;
              }

              authenticating = true;
              rest.all('api/authorizations/pour').post({ deviceId: deviceId }).then(function() {
                  authenticating = false;
                  popup.close();
              }, function(e) {
                  authenticating = false;
              });
          },
          processUri: function (rawUri) {
              var parser = document.createElement('a');
              parser.href = rawUri;

              if (rawUri.indexOf('//view-tap') >= 0) {
                  var deviceId = getQueryVariable(parser.search.substring(1), 'deviceId');

                  if (!deviceId) {
                      return;
                  }

                  if (requestPour) {
                      output.authenticatePour(deviceId);
                  }

                  // navigate
                  $state.go('app.device-taps', { deviceId: deviceId });
              }

          },
          showPopup: function () {
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
              popup.then(function () {
                  requestPour = false;
                  popup = null;
              });
          }
      };

      return output;
  }]);
