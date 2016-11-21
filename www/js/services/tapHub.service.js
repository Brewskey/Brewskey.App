angular.module('brewskey.services')
    .factory('tapHub', ['$rootScope', '$q', 'Hub', 'Restangular',
    function ($rootScope, $q, Hub, rest) {
        var subscriptions = {};
        var pours = {};
        var kegPours = {};
        var leaderboards = [];
        var kegLeaderboards = [];

        var setArrayToType = {
            'keg-pours': kegPours,
            'pours': pours,
            'leaderboards': leaderboards,
            'keg-leaderboards': kegLeaderboards
        }


        function reloadSet(type, tapId, kegId) {
            var promise;
            if (type === 'keg-pours') {
                promise = rest.one('api/taps', tapId).getList('keg-pours');
            } else if (type === 'pours') {
                promise = rest.one('api/taps', tapId).getList('pours');
            } else if (type === 'leaderboards') {
                promise = rest.one('api/taps', tapId).getList('leaderboard');
            } else if (type === 'keg-leaderboards') {
                promise = rest.one('api/taps', tapId).one('leaderboard', kegId).getList();
            } else {
                throw "Bad type " + type;
            }

            var array = setArrayToType[type];

            var id = type === 'keg-leaderboards'
                ? kegId
                : tapId;

            var shouldRemoveExisting = array[id] && array[id].length;

            var arrayToExtend = array[id] = _.compact([].concat(array[id]));
            promise.then(function (result) {
                if (shouldRemoveExisting) {
                    arrayToExtend.splice(0, arrayToExtend.length);
                }
                angular.extend(arrayToExtend, result);
            });
            return arrayToExtend;
        }

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
                            totalOunces: 0,
                        };
                        leaderboard.push(userPours);
                    }
                    if (!userKegPours) {
                        userKegPours = {
                            lastPourDate: null,
                            userName: pour.pouredBy,
                            totalOunces: 0,
                        };
                        kegLeaderboard.push(userKegPours);
                    }
                    userKegPours.lastPourDate = pour.pourDate;
                    userKegPours.totalOunces += pour.ounces;
                    $rootScope.$apply();
                }
            },
            //server side methods
            methods: ['subscribe', 'unsubscribe'],
            //handle connection error
            errorHandler: function (error) {
                console.error(error);
            },
            rootPath: 'https://brewskey.com/signalr',
        });

        var getByType = function(type, tapId, kegId) {
            var array = setArrayToType[type];
            if (!array) {
                throw "WTF";
            }
            
            if (!array[kegId || tapId]) {
                if (!subscriptions[tapId]) {
                    subscriptions[tapId] = true;
                    hub.promise.then(function () {
                        hub.subscribe(tapId);
                    });
                }

                reloadSet(type, tapId, kegId);
            }

            return array[kegId || tapId];
        }
        var getKegPours = function(tapId) {
            return getByType('keg-pours', tapId);
        };
        var getPours = function (tapId) {
            return getByType('pours', tapId);
        };
        var getLeaderboard = function (tapId) {
            return getByType('leaderboards', tapId);
        };
        var getKegLeaderboard = function (tapId, kegId) {
            return getByType('keg-leaderboards', tapId, kegId);
        };

        output = {
            getKegPours: getKegPours,
            getPours: getPours,
            getLeaderboard: getLeaderboard,
            getKegLeaderboard: getKegLeaderboard,
            reload: function (types, tapId, kegId) {
                if (!types) {
                    return;
                }

                types.forEach(function (type) {
                    reloadSet(type, tapId, kegId);
                });
            },
        };

        return output;
    }]);
