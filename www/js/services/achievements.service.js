angular.module('tappt.services')
.factory('achievements', ['$rootScope', '$ionicPopup', 'Restangular', 'Hub', '$localStorage',
function ($rootScope, $ionicPopup, rest, Hub, $storage) {
    var hub = new Hub('achievementHub', {
        //client side methods
        listeners: {
            'newAchievements': showPopups
        },
        //server side methods
        methods: ['subscribe', 'unsubscribe'],
        //handle connection error
        errorHandler: function (error) {
            console.error(error);
        },
        rootPath: 'https://tappt.io/signalr',
    });

    hub.promise.then(function () {
        var authList = $storage.authList;
        if (!authList) {
            return;
        }

        authList.map(function (authDetails) {
            subscribe(authDetails.userName);
        });
    });

    function subscribe(userName) {
        hub.promise.then(function () {
            hub.subscribe(userName);
        });
    }

    function unsubscribe(userName) {
        hub.promise.then(function () {
            hub.unsubscribe(userName);
        });
    }

    function showPopups(achievements, index) {
        var scope = $rootScope.$new();
        scope.index = index || 0;
        scope.achievements = achievements;
        scope.currentAchievement = achievements[scope.index];

        var popup = $ionicPopup.alert({
            cssClass: 'achievement-popup',
            scope: scope,
            templateUrl: 'templates/achievement.html',
            title: "Achievement",
        });

        scope.next = function ($event) {
            $event.stopPropagation();
            scope.index++;
            if (scope.index >= achievements.length) {
                scope.index = 0;
            }

            scope.currentAchievement = achievements[scope.index];
        };

        scope.prev = function ($event) {
            $event.stopPropagation();
            scope.index--;
            if (scope.index < 0) {
                scope.index = achievements.length - 1;
            }

            scope.currentAchievement = achievements[scope.index];
        };
    }

    return {
        showPopups: showPopups,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
    };
}]);
