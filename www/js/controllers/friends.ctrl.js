angular.module('brewskey.controllers')
.controller('FriendsCtrl', ['$scope', 'Restangular', function ($scope, rest) {
    $scope.loading = true;
    rest.all('api/friends').getList().then(function (friends) {
        $scope.loading = false;
        $scope.friends = friends;
    });
    rest.all('api/friends/requests').getList().then(function (requests) {
        $scope.requests = requests;
    });

    function onSuccess(contacts) {
        $scope.contactsLoaded = true;
        $scope.contacts = contacts.filter(function (contact) {
            var displayName = contact.displayName;
            if (!displayName) {
                return false;
            }

            if (displayName.indexOf("#") === 0) {
                return false;
            }

            if (!contact.nickname) {
                return false;
            }

            return true;
        });
    };

    function onError(contactError) {
        $scope.contactsError = true;
    };

    if (typeof ContactFindOptions !== 'undefined') {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        options.hasPhoneNumber = true;
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];

        navigator.contacts.find(fields, onSuccess, onError, options);
    }
    $scope.acceptFriend = function (request) {
        request.status = 1;
        request.put();

        $scope.requests = _.filter($scope.requests, function (r) {
            return r !== request;
        });
    };

    $scope.denyFriend = function (request) {
        request.remove();

        $scope.requests = _.filter($scope.requests, function (r) {
            return r !== request;
        });
    };
}]);