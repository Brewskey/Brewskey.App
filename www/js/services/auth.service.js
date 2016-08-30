// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('brewskey.services', [])
.factory("auth",
  ['$q', 'Restangular', '$localStorage', '$ionicHistory', '$state', 'achievements', '$http',
  function ($q, rest, storage, $ionicHistory, $state, achievements, $http) {
      if (storage.authDetails && !storage.authList) {
          storage.authList = [storage.authDetails];
      }

      var refreshTokenPromise = null;

      var output = {
          isLoggedIn: function () {
              return !(!storage.authDetails);
          },
          register: function (model) {
              return rest.one('api/account').post('register', model);
          },
          login: function (model) {
              var authorization = rest.one('token').withHttpConfig({ transformRequest: angular.identity });

              var data = "grant_type=password&username=" + encodeURIComponent(model.userName) + "&password=" + encodeURIComponent(model.password)

              return authorization
                .customPOST(data, '', {}, {
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
                .then(function (response) {
                    storage.authDetails = response;
                    storage.authList = _.uniqBy((storage.authList || []).concat(response), 'userName');

                    achievements.subscribe(storage.authDetails.userName);

                    return response;
                });
          },
          refreshToken: function () {
              if (refreshTokenPromise) {
                  return refreshTokenPromise;
              }

              if (!storage.authDetails) {
                  var defer = $q.defer();
                  defer.reject();
                  return defer.promise;
              }

              var authorization = rest.one('token').withHttpConfig({ transformRequest: angular.identity });
              var data = "grant_type=refresh_token&refresh_token=" + storage.authDetails.refresh_token;
              storage.authDetails = null;

              return refreshTokenPromise = authorization
                .customPOST(data, '', {}, {
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
                .then(function (response) {
                    storage.authDetails = response;
                    storage.authList = _.uniqBy((storage.authList || []).concat(response), 'userName');

                    achievements.subscribe(storage.authDetails.userName);
                    refreshTokenPromise = null;

                    return response;
                }, function () {
                    refreshTokenPromise = null;
                });
          },
          logout: function () {
              if (storage.authDetails) {
                  achievements.unsubscribe(storage.authDetails.userName);
              }
              storage.authDetails = null;
              storage.authList = null;

              $ionicHistory.nextViewOptions({
                  historyRoot: true
              });

              $state.go('app.login');
          },
          updateAccount: function (model) {
              var promises = [];
              if (model.newPassword && model.oldPassword) {
                  promises.push(rest.one('api/account').post(
                      'change-password',
                      {
                          confirmPassword: model.oldPassword,
                          newPassword: model.newPassword,
                          oldPassword: model.oldPassword,
                      }));
              }

              if (model.phoneNumber !== storage.authDetails.phoneNumber) {
                  promises.push(
                      rest.one('api/account/update-phone-number')
                      .put({ phoneNumber: model.phoneNumber })
                  );
              }

              return $q.all(promises);
          },
          sendPhoneToken: function (model) {
              return rest.one('api/account/send-phone-token')
                  .put({ phoneNumber: model.phoneNumber, token: model.token })
                  .then(function (response) {
                      storage.authDetails.phoneNumber = model.phoneNumber;
                  });
          },
          sendTotp: function (phoneNumber) {
              return rest.one('api/account').post('send-totp', { phoneNumber: phoneNumber });
          },
          loginTotp: function (totp) {
              return rest.one('api/account').post('login-totp', { totp: totp });
          },
      };


      var timeToAdd = 60 * 1000 * 60 * 24; // 1 day
      // Handle authenticating with web services
      rest.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
          if (output.isLoggedIn()) {
              var issuedDate = new Date(storage.authDetails[".issued"]);
              if (new Date(issuedDate.getTime() + timeToAdd) < new Date()) {
                  output.refreshToken();
              } else {
                  headers.Authorization = 'Bearer ' + storage.authDetails.access_token;
              }
          }

          return {
              element: element,
              headers: headers,
              params: params,
              httpConfig: httpConfig
          };
      });

      rest.setErrorInterceptor(function (response, deferred, responseHandler) {
          if (response.status !== 401) {
              return true;
          }

          output.refreshToken()
            .then(function () {
                // Any requests that failed because of a token refresh
                response.config.headers.Authorization = 'Bearer ' + storage.authDetails.access_token;
                $http(response.config).then(function (refreshResponse) {
                    // TODO restangularize
                    deferred.resolve(refreshResponse.data);
                }, deferred.reject);
            }, function () {
                output.logout();
            });

          return false; // error handled
      });

      return output;
  }]);
