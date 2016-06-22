angular.module('brewskey.controllers')
.controller('FriendsCtrl', ['$scope', 'Restangular', function($scope, rest) {
    rest.all('api/friends').getList().then(function (friends) {
        $scope.friends = friends;
    });
    rest.all('api/friends/requests').getList().then(function (requests) {
        $scope.requests = requests;
    });

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