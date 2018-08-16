angular.module('brewskey.services').factory('friends', [
  'Restangular',
  function(rest) {
    function toMD5(contact) {
      return md5(
        (contact.phoneNumbers[0].value || '').replace(/\D/g, '')
      ).toUpperCase();
    }

    return {
      addFriend: function(contact) {
        return rest.one('api/friends/request-by-md5/' + toMD5(contact)).post();
      },
      addFriendByUsername: function(userName) {
        return rest
          .one(
            'api/friends/request-by-username/' + encodeURIComponent(userName)
          )
          .post();
      },
      checkContacts: function(contacts) {
        var md5PhoneNumbers = contacts.map(function(contact, index) {
          return toMD5(contact);
        });

        return rest.all('api/friends/check-contacts').post(md5PhoneNumbers);
      },
      getFriends: function() {
        return rest.all('api/friends').getList();
      },
      getRequests: function() {
        return rest.all('api/friends/requests').getList();
      },
      removeFriend: function(id) {
        return rest.one('api/friends/requests/' + id + '/').remove();
      }
    };
  }
]);
