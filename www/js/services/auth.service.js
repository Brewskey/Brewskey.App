// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('brewskey.services', [])
.factory("auth",
  ['Restangular', '$localStorage', '$ionicHistory', '$state', 'achievements',
  function (rest, storage, $ionicHistory, $state, achievements) {
      if (storage.authDetails && !storage.authList) {
          storage.authList = [storage.authDetails];
      }

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
          }
      };

      // Handle authenticating with web services
      rest.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {
          if (output.isLoggedIn()) {
              headers.Authorization = 'Bearer ' + storage.authDetails.access_token;
          }

          return {
              element: element,
              headers: headers,
              params: params,
              httpConfig: httpConfig
          };
      });

      rest.setErrorInterceptor(function (response, deferred, responseHandler) {
          if (response.status === 401) {
              output.logout();

              return false; // error handled
          }

          return true; // error not handled
      });

      return output;
  }]);
