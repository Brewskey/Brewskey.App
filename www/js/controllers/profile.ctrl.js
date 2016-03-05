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
            $scope.achievements = response.achievements.map(function(item) {
                return angular.extend({}, { count: item.count }, item.achievement);
            });
        });

        $scope.translateToOunces = converter.translateToOunces;

        $scope.getImage = function (achievement) {
            return achievements.images[achievement.achievementType];
        };

        $scope.clickAchievement = function (index) {
            achievements.showPopups($scope.achievements, index);
        };
    }]);