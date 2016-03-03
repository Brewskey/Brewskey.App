angular.module('tappt.controllers')
.controller('ProfileCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', 'converter', 'achievements',
    function ($scope, rest, $stateParams, $storage, converter, achievements) {
        $scope.userName = $stateParams.userName || $storage.authDetails.userName;

        if (navigator.userAgent.match(/iemobile/i)) {
            $scope.isWP8 = true;
        }

        rest.one('api/profile', escape($scope.userName)).get().then(function (response) {
            response.totalPints = Math.round(converter.translateToPints(response.lifetimeTotal));
            $scope.profile = response;
        });

        $scope.translateToOunces = converter.translateToOunces;

        var items = [];
        for (var i = 0; i < 10; i++) {
            items.push({
                url: 'http://fillmurray.com/70/70',
            });
        }

        $scope.achievements = items;
        $scope.clickAchievement = function (index) {
            achievements.showPopups($scope.achievements, index);
        };
    }]);