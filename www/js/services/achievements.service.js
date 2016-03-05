angular.module('tappt.services')
.factory('achievements', ['$rootScope', '$ionicPopup', 'Restangular', 'Hub', '$localStorage',
function ($rootScope, $ionicPopup, rest, Hub, $storage) {
    var achievementImages = {
        1: 'img/icons/beer-cap.png',
        100: 'img/icons/bottle-opener.png',
        101: 'img/icons/bottle-opener.png',
        102: 'img/icons/glass-with-foam.png',
        103: 'img/icons/mug-without-foam.png',
        104: 'img/icons/mug-lined-with-foam.png',
        105: 'img/icons/glass-seven.png',
        106: 'img/icons/mug-broken.png',
        200: 'img/icons/bottle.png',
        201: 'img/icons/bottle.png',
        202: 'img/icons/bottle.png',
        203: 'img/icons/bottle.png',
        301: 'img/icons/keg.png',
        302: 'img/icons/keg.png',
        303: 'img/icons/keg.png',
        304: 'img/icons/glass-empty.png',
        305: 'img/icons/bottle.png',
        400: 'img/icons/mug-broken.png',
    }

    var hub = new Hub('achievementHub', {
        //client side methods
        listeners: {
            'newAchievements': function (achievements) {
                if (navigator.vibrate) {
                    navigator.vibrate([300, 10, 300, 10, 300]);
                }
                showPopups(achievements, 0);
            }
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
        scope.image = achievementImages[scope.currentAchievement.achievementType];

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
            scope.image = achievementImages[scope.currentAchievement.achievementType];
        };

        scope.prev = function ($event) {
            $event.stopPropagation();
            scope.index--;
            if (scope.index < 0) {
                scope.index = achievements.length - 1;
            }

            scope.currentAchievement = achievements[scope.index];
            scope.image = achievementImages[scope.currentAchievement.achievementType];
        };
    }

    return {
        images: achievementImages,
        showPopups: showPopups,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
    };
}]);
