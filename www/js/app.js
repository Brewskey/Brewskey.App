angular.module('tappt', ['ionic', 'ngMessages', 'tappt.controllers', 'tappt.directives', 'tappt.services', 'ngStorage', 'restangular', 'angularMoment', 'SignalR'])

.run(function ($ionicPlatform, $rootScope, auth, $ionicHistory, $state, $localStorage, nfcService) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        if (window.cordova && window.cordova.platformId === 'windows') {
            // Get the back button working in WP8.1
            WinJS.Application.onbackclick = function () {
                if (!$ionicHistory.backView()) {
                    window.close();

                    return false;
                }

                $ionicHistory.goBack();
                return true; // This line is important, without it the app closes.
            }
        }

        $localStorage.$default({
            'settings': {
                pushNotifications: true,
                manageLocations: false
            }
        });
    });

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
          if (toState.authenticate && !auth.isLoggedIn()) {
              $ionicPlatform.ready(function () {
                  $ionicHistory.nextViewOptions({
                      historyRoot: true
                  });

                  $state.go('app.login');
              });
          }
      });


})
.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
})
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',

function ($stateProvider, $urlRouterProvider, rest) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        noAuth: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.login', {
        url: "/login",
        views: {
            'menuContent': {
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.register', {
        url: "/register",
        views: {
            'menuContent': {
                templateUrl: "templates/register.html",
                controller: 'RegisterCtrl'
            }
        }
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        }
    })

    .state('app.home', {
        authenticate: true,
        cache: false,
        url: "/home",
        views: {
            'menuContent': {
                controller: 'HomeCtrl',
                templateUrl: "templates/home.html",
            }
        }
    })
    .state('app.locations', {
        authenticate: true,
        cache: false,
        url: "/locations",
        views: {
            'menuContent': {
                templateUrl: "templates/locations.html",
                controller: 'LocationsCtrl'
            }
        }
    })

    .state('app.new-locations', {
        authenticate: true,
        url: "/location/new",
        views: {
            'menuContent': {
                templateUrl: "templates/new-location.html",
                controller: 'NewLocationCtrl'
            }
        }
    })
    .state('app.location', {
        authenticate: true,
        cache: false,
        url: "/location/:locationId",
        views: {
            'menuContent': {
                templateUrl: "templates/location.html",
                controller: 'LocationCtrl'
            }
        }
    })
    .state('app.edit-location', {
        authenticate: true,
        url: "/location/:locationId/edit",
        views: {
            'menuContent': {
                templateUrl: "templates/new-location.html",
                controller: 'NewLocationCtrl'
            }
        }
    })
    .state('app.taps', {
        authenticate: true,
        cache: false,
        url: "/taps/",
        views: {
            'menuContent': {
                templateUrl: "templates/taps.html",
                controller: 'TapsCtrl'
            }
        }
    })
    .state('app.new-tap', {
        authenticate: true,
        url: "/taps/new/?:locationId",
        views: {
            'menuContent': {
                templateUrl: "templates/new-tap.html",
                controller: 'NewTapCtrl'
            }
        }
    })
    .state('app.device-taps', {
        authenticate: true,
        cache: false,
        url: "/device-taps/:deviceId",
        views: {
            'menuContent': {
                templateUrl: "templates/tap.html",
                controller: 'TapCtrl'
            }
        }
    })
    .state('app.tap', {
        abstract: true,
        url: "/taps/:tapId",
        views: {
            'menuContent': {
                templateUrl: "templates/tap.html",
            }
        }
    })
    .state('app.tap.leaderboard', {
        authenticate: true,
        cache: false,
        url: "/leaderboard",
        views: {
            'leaderboard-tab': {
                templateUrl: "templates/tap.leaderboard.html",
                controller: 'TapCtrl'
            }
        }
    })
    .state('app.tap.info', {
        authenticate: true,
        cache: false,
        url: "/info",
        views: {
            'info-tab': {
                templateUrl: "templates/tap.info.html",
                controller: 'TapCtrl'
            }
        }
    })
    .state('app.tap.stats', {
        authenticate: true,
        cache: false,
        url: "/stats",
        views: {
            'stats-tab': {
                templateUrl: "templates/tap.stats.html",
                controller: 'TapCtrl'
            }
        }
    })
    .state('app.edit-tap', {
        authenticate: true,
        url: "/taps/:tapId/edit",
        views: {
            'menuContent': {
                templateUrl: "templates/new-tap.html",
                controller: 'NewTapCtrl'
            }
        }
    })

    .state('app.new-keg', {
        authenticate: true,
        url: "/keg/new/:tapId",
        views: {
            'menuContent': {
                templateUrl: "templates/new-keg.html",
                controller: 'NewKegCtrl'
            }
        }
    })
    .state('app.keg', {
        authenticate: true,
        cache: false,
        url: "/tap/:kegId",
        views: {
            'menuContent': {
                templateUrl: "templates/keg.html",
                controller: 'KegCtrl'
            }
        }
    })
    .state('app.edit-keg', {
        authenticate: true,
        url: "/keg/:kegId/edit",
        views: {
            'menuContent': {
                templateUrl: "templates/new-keg.html",
                controller: 'NewKegCtrl'
            }
        }
    })

    .state('app.write-tags', {
        url: "/write-tags",
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: "templates/write-tags.html",
                controller: 'WriteTagsCtrl'
            }
        }
    })

    .state('app.settings', {
        url: "/settings",
        authenticate: true,
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');

    // Restangular setup
    rest.setBaseUrl('https://tappt.io');
    //rest.setBaseUrl('http://localhost:2483');
}]);
