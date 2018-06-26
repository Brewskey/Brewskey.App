angular.module('brewskey.controllers').controller('FriendsCtrl', [
  '$scope',
  '$localStorage',
  'friends',
  function($scope, storage, friends) {
    $scope.loading = true;

    function getFriends() {
      friends.getFriends().then(function(friends) {
        $scope.loading = false;
        $scope.friends = friends;
      });
    }

    getFriends();

    friends.getRequests().then(function(requests) {
      $scope.requests = requests;
    });

    function onSuccess(contacts) {
      $scope.contactsLoaded = true;
      contacts = contacts.filter(function(contact) {
        var displayName = (contact.displayName =
          contact.name && contact.name.formatted);

        if (!displayName) {
          return false;
        }

        if (displayName.indexOf('#') === 0) {
          return false;
        }

        if (!contact.phoneNumbers || !contact.phoneNumbers.length) {
          return false;
        }

        return true;
      });

      if (
        contacts.some(function(contact) {
          return contact.name && contact.name.familyName;
        })
      ) {
        contacts = _.sortBy(contacts, function(contact) {
          return contact.name.familyName;
        });
      }

      $scope.contacts = contacts;

      getRegisteredUsers();
    }

    function onError(contactError) {
      $scope.contactsError = true;
    }

    function getRegisteredUsers() {
      friends.checkContacts($scope.contacts).then(function(response) {
        $scope.contactsLoaded = true;
        $scope.contacts = $scope.contacts.map(function(contact, index) {
          var contactInfo = response[index];
          contact.found = contactInfo.found;
          contact.hasRequested = contactInfo.hasRequested;

          return contact;
        });
      });
    }

    if (typeof ContactFindOptions !== 'undefined') {
      var options = new ContactFindOptions();
      options.filter = '';
      options.multiple = true;
      options.hasPhoneNumber = true;
      var fields = [
        navigator.contacts.fieldType.displayName,
        navigator.contacts.fieldType.name
      ];

      setTimeout(function() {
        navigator.contacts.find(fields, onSuccess, onError, options);
      }, 10);
    } else {
      $scope.contacts = JSON.parse(
        '[{"id":"{5.70002.22d}","rawId":null,"displayName":"Aaron","name":{"formatted":"Aaron","familyName":null,"givenName":"Aaron","middleName":null,"honorificPrefix":null,"honorificSuffix":null},"nickname":"Aaron","phoneNumbers":[{"id":null,"type":"1","value":"4064805936","pref":false}],"emails":[],"addresses":[],"ims":[],"organizations":[],"birthday":null,"note":null,"photos":null,"categories":null,"urls":null},{"id":"{5.70002.280}","rawId":null,"displayName":"Aaron Bronow","name":{"formatted":"Aaron Bronow","familyName":"Bronow","givenName":"Aaron","middleName":null,"honorificPrefix":null,"honorificSuffix":null},"nickname":"Aaron","phoneNumbers":[{"id":null,"type":"1","value":"2063954495","pref":false}],"emails":[],"addresses":[],"ims":[],"organizations":[],"birthday":null,"note":null,"photos":null,"categories":null,"urls":null}]'
      );
      getRegisteredUsers();
    }
    $scope.acceptFriend = function(request) {
      request.status = 1;
      request.put().then(function() {
        getFriends();
      });

      $scope.requests = _.filter($scope.requests, function(r) {
        return r !== request;
      });
    };

    $scope.denyFriend = function(request) {
      request.remove();

      $scope.requests = _.filter($scope.requests, function(r) {
        return r !== request;
      });
    };

    $scope.invite = function(contact, index) {
      contact.hasRequested = true;
      // Send SMS

      var number = contact.phoneNumbers[0].value;
      var message =
        'Add me on Brewskey!\nUsername: ' +
        storage.authDetails.userName +
        '\nhttps://app.brewskey.com';

      var options = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT' // send SMS with the native android SMS messaging
        }
      };

      var success = function() {
        $scope.addFriend(contact, index);
      };
      var error = function(e) {
        // show error message :(
      };

      var sendSms = function() {
        sms.send(number, message, options, success, error);
      };

      if (ionic.Platform.isAndroid()) {
        sms &&
          sms.hasPermission(
            function(hasPermission) {
              if (hasPermission) {
                sendSms();
              } else {
                // show permissions modal :(
              }
            },
            function(a, b, c) {
              // show error message :(
            }
          );
      } else {
        sendSms();
      }

      if (ionic.Platform.isWindowsPhone()) {
        $scope.addFriend(contact, index);
      }
    };

    $scope.addFriend = function(contact, index) {
      contact.hasRequested = true;
      $scope.contacts[index] = contact;

      friends.addFriend(contact).then(
        function(a) {
          var c = 0;
        },
        function(g, e, d) {
          var b = 0;
        }
      );
    };
  }
]);
