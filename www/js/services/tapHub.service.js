angular.module('tappt.services')
    .factory('tapHub', ['$rootScope', '$q', 'Hub', 'Restangular',
    function ($rootScope, $q, Hub, rest) {
        var pours = {};
        var kegPours = {};
        var subscriptions = {};
        var leaderboards = [];
        var kegLeaderboards = [];

        var output;

        //declaring the hub connection
        var hub = new Hub('tapHub', {
            //client side methods
            listeners: {
                'newPour': function(pour) {
                    (pours[pour.tapId] || []).splice(0, 0, pour);
                    (kegPours[pour.tapId] || []).splice(0, 0, pour);
                    var leaderboard = leaderboards[pour.tapId];
                    var kegLeaderboard = kegLeaderboards[pour.kegId];
                    var userPours = _.find(leaderboard, function (item) { return item.userName === pour.pouredBy; });
                    var userKegPours = _.find(kegLeaderboard, function (item) { return item.userName === pour.pouredBy; });
                    if (!userPours) {
                        userPours = {
                            lastPourDate: null,
                            userName: pour.pouredBy,
                            totalPulses: 0,
                        };
                        leaderboard.push(userPours);
                    }
                    if (!userKegPours) {
                        userKegPours = {
                            lastPourDate: null,
                            userName: pour.pouredBy,
                            totalPulses: 0,
                        };
                        kegLeaderboard.push(userKegPours);
                    }
                    userKegPours.lastPourDate = pour.pourDate;
                    userKegPours.totalPulses += pour.pulses;
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

        var getKegPours = function(tapId) {
            if (!kegPours[tapId]) {
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }
                rest.one('api/taps', tapId).getList('keg-pours').then(function (result) {
                    angular.extend(kegPours[tapId], result);
                });
                kegPours[tapId] = [];
            }
            return kegPours[tapId];
        };
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
                leaderboards[tapId] = [];
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }
                rest.one('api/taps', tapId).getList('leaderboard').then(function (result) {
                    angular.extend(leaderboards[tapId], result);
                });
            }
            return leaderboards[tapId];
        };
        var getKegLeaderboard = function (tapId, kegId) {
            if (!kegLeaderboards[kegId]) {
                kegLeaderboards[kegId] = [];
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }
                rest.one('api/taps', tapId).one('leaderboard', kegId).getList().then(function (result) {
                    angular.extend(kegLeaderboards[kegId], result);
                });
            }
            return kegLeaderboards[kegId];
        };

        output = {
            getKegPours: getKegPours,
            getPours: getPours,
            getLeaderboard: getLeaderboard,
            getKegLeaderboard: getKegLeaderboard,
        };

        return output;
    }]);
