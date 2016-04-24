angular.module('tappt.services')
.factory('achievements', ['$rootScope', '$ionicPopup', 'Restangular', 'Hub', '$localStorage',
function ($rootScope, $ionicPopup, rest, Hub, $storage) {
    var achievementImages = {
        1: 'Welcome',
        100: 'BeerBeforeNoon',
        101: 'FirstPourOfTheDay',
        102: 'HatTrick',
        103: 'LastPourOfTheNight',
        104: 'PowerHour',
        105: 'SevenDaysStraight',
        106: 'BackOnTheBus',
        200: 'BeerBuff',
        201: 'BeerAuthority',
        202: 'BeerAficionado',
        203: 'BeerConnoisseur',
        301: 'DrankAKeg',
        302: 'DrankFiveKegs',
        303: 'DrankTenKegs',
        304: 'LightWeight',
        305: 'Edward40Hands',
        400: 'LastPourOfTheKeg',
        401: 'KingOfTheKeg',
    };

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
        var authDetails = $storage.authDetails;
        if (!authDetails) {
            return;
        }

        subscribe(authDetails.userName);
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
