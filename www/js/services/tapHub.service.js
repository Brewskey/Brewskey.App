angular.module('tappt.services')
    .factory('tapHub', ['$rootScope', '$q', 'Hub', 'Restangular',
    function ($rootScope, $q, Hub, rest) {
        var pours = {};
        var subscriptions = {};
        var leaderboards = [];

        //declaring the hub connection
        var hub = new Hub('tapHub', {
            //client side methods
            listeners: {
                'newPour': function (pour) {
                    (pours[pour.tapId] || []).splice(0, 0, pour);
                    var leaderboard = leaderboards[pour.tapId];
                    var userPours = _.find(leaderboard, function (item) { return item.userName === pour.pouredBy; });
                    if (!userPours) {
                        userPours = {
                            lastPourDate: null,
                            userName: pour.pouredBy,
                            totalPulses: 0,
                        };
                        leaderboard.push(userPours);
                    }
                    userPours.lastPourDate = pour.pourDate,
                        userPours.totalPulses += pour.pulses;
                    $rootScope.$apply();
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

        var getPours = function (tapId) {
            if (!pours[tapId]) {
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }
                rest.one('api/taps', tapId).getList('pours').then(function (result) {
                    angular.extend(pours[tapId], result);
                });
                pours[tapId] = [];
            }
            return pours[tapId];
        };
        var getLeaderboard = function (tapId) {
            if (!leaderboards[tapId]) {
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }
                rest.one('api/taps', tapId).getList('leaderboard').then(function (result) {
                    angular.extend(leaderboards[tapId], result);
                });
                leaderboards[tapId] = [];
            }
            return leaderboards[tapId];
        };
        return {
            getPours: getPours,
            getLeaderboard: getLeaderboard
        };
    }]);
