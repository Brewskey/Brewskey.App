// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tappt.services')
.factory("nfc", 
  [ '$q',
  function ($q) { 

    var output = {
      writeTag: function (authKey) {
        var message = [
          ndef.textRecord(authKey)
        ];

        return $q(function (resolve, reject) {
          nfc.write(message, resolve, reject);
        })
      },
      authenticatePour: function () {

      }
    };

    return output;
  }]);
