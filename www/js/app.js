ionic.Platform.noScroll = function() {
  return (
    ionic.Platform.isWindowsPhone() ||
    ionic.Platform.ua.toLowerCase().indexOf('trident') > -1 ||
    ionic.Platform.ua.toLowerCase().indexOf('edge') > -1 ||
    ionic.Platform.platform() === 'edge'
  );
};
// Fancy Updater :)
var codePushParams = {
  installMode: window.InstallMode && InstallMode.IMMEDIATE,
  updateDialog: false,
};
angular
  .module('brewskey', [
    'ionic',
    'ngMessages',
    'brewskey.controllers',
    'brewskey.directives',
    'brewskey.services',
    'ngStorage',
    'restangular',
    'angularMoment',
    'SignalR',
    'chart.js',
    'ngMask',
    'ngIntlTelInput',
  ])
  .run(function(
    $ionicPlatform,
    $rootScope,
    auth,
    $ionicHistory,
    $state,
    $localStorage,
    nfcService,
  ) {
    $ionicPlatform.ready(function() {
      window.codePush !== undefined && codePush.sync(null, codePushParams);

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (
        window.cordova &&
        window.cordova.plugins &&
        window.cordova.plugins.Keyboard &&
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar
      ) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      //navigator.splashscreen.hide();

      if (window.cordova && window.cordova.platformId === 'windows') {
        // Get the back button working in WP8.1
        WinJS.Application.onbackclick = function() {
          if (!$ionicHistory.backView()) {
            window.close();

            return false;
          }

          $ionicHistory.goBack();
          return true; // This line is important, without it the app closes.
        };
      }

      $localStorage.$default({
        settings: {
          pushNotifications: true,
          manageLocations: false,
        },
      });
    });

    // Get updates if the app is resumed
    document.addEventListener('resume', function() {
      // This function is called when using NFC on android and breaks things :/
      if (window.cordova && window.cordova.platformId === 'android') {
        return;
      }
      window.codePush && codePush.sync(null, codePushParams);
    });

    $rootScope.$on('$stateChangeStart', function(
      event,
      toState,
      toParams,
      fromState,
      fromParams,
    ) {
      $ionicPlatform.ready(function() {
        // All accounts need to set up a phone number.
        // if (
        //   auth.isLoggedIn() &&
        //   !$localStorage.authDetails.phoneNumber &&
        //   toState.name !== 'app.profile-edit'
        // ) {
        //   setTimeout(function() {
        //     $ionicHistory.clearHistory();
        //     $state.go('app.profile-edit');
        //   }, 10);
        //   return;
        // }

        if (toState.authenticate && !auth.isLoggedIn()) {
          $ionicHistory.nextViewOptions({
            historyRoot: true,
          });

          $state.go('app.login');
        }
      });
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(
      /^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|ms-appx-web|x-wmapp0):/,
    );
    $compileProvider.imgSrcSanitizationWhitelist(
      /^\s*(https?|ftp|file|ms-appx|ms-appx-web|x-wmapp0):|data:image\//,
    );
  })
  .config(function(ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({
      initialCountry: 'us',
      utilsScript: './lib/intl-tel-input/js/utils.js',
    });
  })
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'RestangularProvider',
    '$ionicConfigProvider',

    function($stateProvider, $urlRouterProvider, rest, $ionicConfigProvider) {
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');

      // Restangular setup
      rest.setDefaultHeaders({
        timezoneOffset: new Date().getTimezoneOffset(),
        Prefer: 'return=representation',
      });
      rest.setBaseUrl('https://brewskey.com');
      rest.setRequestSuffix('/');
      //rest.setBaseUrl('http://localhost:2484');

      $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          noAuth: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl',
        })
        .state('app.login', {
          url: '/login',
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl',
            },
          },
        })
        .state('app.login-number', {
          url: '/login-number',
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/login.number.html',
              controller: 'LoginNumberCtrl',
            },
          },
        })
        .state('app.profile', {
          url: '/profile/:userName',
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/profile.html',
              controller: 'ProfileCtrl',
            },
          },
        })
        .state('app.profile-edit', {
          url: '/profile-edit',
          cache: false,
          params: {
            isSetup: false,
          },
          views: {
            menuContent: {
              templateUrl: 'templates/profile-edit.html',
              controller: 'ProfileEditCtrl',
            },
          },
        })
        .state('app.accounts', {
          url: '/accounts',
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/accounts.html',
              controller: 'AccountsCtrl',
            },
          },
        })
        .state('app.register', {
          url: '/register',
          cache: false,
          params: {
            externalAuthToken: null,
          },
          views: {
            menuContent: {
              templateUrl: 'templates/register.html',
              controller: 'RegisterCtrl',
            },
          },
        })
        .state('app.forgot-password', {
          url: '/forgot-password',
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/forgot-password.html',
              controller: 'ForgotPasswordCtrl',
            },
          },
        })
        .state('app.search', {
          url: '/search',
          views: {
            menuContent: {
              templateUrl: 'templates/search.html',
            },
          },
        })
        .state('app.home', {
          authenticate: true,
          cache: false,
          url: '/home',
          views: {
            menuContent: {
              controller: 'NearyLocationsCtrl',
              templateUrl: 'templates/nearby-locations.html',
            },
          },
        })
        .state('app.setup-wifi', {
          authenticate: true,
          cache: false,
          params: {
            isCreatingNewDevice: false,
          },
          url: '/setup-wifi',
          views: {
            menuContent: {
              templateUrl: 'templates/wifi.html',
              controller: 'WifiCtrl',
            },
          },
        })
        .state('app.devices', {
          authenticate: true,
          cache: false,
          url: '/devices',
          views: {
            menuContent: {
              templateUrl: 'templates/devices.html',
              controller: 'DevicesCtrl',
            },
          },
        })
        .state('app.new-device', {
          authenticate: true,
          cache: false,
          params: {
            deviceId: null,
            particleId: null,
          },
          url: '/devices/new/:particleId',
          views: {
            menuContent: {
              templateUrl: 'templates/new-device.html',
              controller: 'NewDeviceCtrl',
            },
          },
        })
        .state('app.device', {
          authenticate: true,
          cache: false,
          url: '/devices/:deviceId',
          views: {
            menuContent: {
              templateUrl: 'templates/device.html',
              controller: 'DeviceCtrl',
            },
          },
        })
        .state('app.edit-device', {
          authenticate: true,
          cache: false,
          url: '/devices/:deviceId/edit',
          views: {
            menuContent: {
              controller: 'NewDeviceCtrl',
              templateUrl: 'templates/new-device.html',
            },
          },
        })
        .state('app.friends', {
          abstract: true,
          authenticate: true,
          cache: false,
          url: '/friends',
          views: {
            menuContent: {
              templateUrl: 'templates/friends.html',
              controller: 'FriendsCtrl',
            },
          },
        })
        .state('app.friends.list', {
          authenticate: true,
          cache: false,
          url: '/list',
          views: {
            'friends-list-view': {
              templateUrl: 'templates/friends.list.html',
            },
          },
        })
        .state('app.friends.list.friend', {
          authenticate: true,
          cache: false,
          url: '/:userName',
          views: {
            'friends-list-view': {
              templateUrl: 'templates/profile.html',
              controller: 'ProfileCtrl',
            },
          },
        })
        .state('app.friends.requests', {
          authenticate: true,
          cache: false,
          url: '/requests',
          views: {
            'requests-list-view': {
              templateUrl: 'templates/friends.requests.html',
            },
          },
        })
        .state('app.friends.requests.friend', {
          authenticate: true,
          cache: false,
          url: '/:userName',
          views: {
            'requests-list-view': {
              templateUrl: 'templates/profile.html',
              controller: 'ProfileCtrl',
            },
          },
        })
        .state('app.friends.contacts', {
          authenticate: true,
          cache: false,
          url: '/contacts',
          views: {
            'contacts-list-view': {
              templateUrl: 'templates/friends.contacts.html',
            },
          },
        })
        .state('app.locations', {
          authenticate: true,
          cache: false,
          url: '/locations',
          views: {
            menuContent: {
              templateUrl: 'templates/locations.html',
              controller: 'LocationsCtrl',
            },
          },
        })
        .state('app.new-location', {
          authenticate: true,
          cache: false,
          url: '/location/new',
          params: {
            isCreatingNewDevice: false,
          },
          views: {
            menuContent: {
              templateUrl: 'templates/new-location.html',
              controller: 'NewLocationCtrl',
            },
          },
        })
        .state('app.location', {
          abstract: true,
          authenticate: true,
          cache: false,
          url: '/location/:locationId',
          views: {
            menuContent: {
              templateUrl: 'templates/location.html',
              controller: 'LocationCtrl',
            },
          },
        })
        .state('app.location.info', {
          authenticate: true,
          cache: false,
          url: '/info',
          views: {
            'tab-view': {
              templateUrl: 'templates/location.info.html',
            },
          },
        })
        .state('app.location.schedules', {
          authenticate: true,
          cache: false,
          url: '/schedules',
          views: {
            'tab-view': {
              controller: 'SchedulesCtrl',
              templateUrl: 'templates/schedules.html',
            },
          },
        })
        .state('app.location.new-schedule', {
          url: '/schedules/new',
          authenticate: true,
          views: {
            'tab-view': {
              templateUrl: 'templates/new-schedule.html',
              controller: 'NewScheduleCtrl',
            },
          },
        })
        .state('app.location.edit', {
          authenticate: true,
          cache: false,
          url: '/location/:locationId/edit',
          views: {
            'tab-view': {
              controller: 'NewLocationCtrl',
              templateUrl: 'templates/new-location.html',
            },
          },
        })
        .state('app.taps', {
          authenticate: true,
          cache: false,
          url: '/taps/',
          views: {
            menuContent: {
              templateUrl: 'templates/taps.html',
              controller: 'TapsCtrl',
            },
          },
        })
        .state('app.new-tap', {
          authenticate: true,
          cache: false,
          params: {
            deviceId: null,
            locationId: null,
            tapId: null,
          },
          url: '/taps/new/',
          views: {
            menuContent: {
              templateUrl: 'templates/new-tap.html',
              controller: 'NewTapCtrl',
            },
          },
        })
        .state('app.device-taps', {
          authenticate: true,
          cache: false,
          url: '/device-taps/:deviceId',
          views: {
            menuContent: {
              templateUrl: 'templates/tap.html',
              controller: 'TapCtrl',
            },
          },
        })
        .state('app.tap', {
          abstract: true,
          cache: false,
          url: '/taps/:tapId',
          views: {
            menuContent: {
              controller: 'TapCtrl',
              templateUrl: 'templates/tap.html',
            },
          },
        })
        .state('app.tap.leaderboard', {
          authenticate: true,
          cache: false,
          url: '/leaderboard',
          views: {
            'tab-view': {
              templateUrl: 'templates/tap.leaderboard.html',
            },
          },
        })
        .state('app.tap.info', {
          authenticate: true,
          cache: false,
          url: '/info',
          views: {
            'tab-view': {
              templateUrl: 'templates/tap.info.html',
            },
          },
        })
        .state('app.tap.stats', {
          authenticate: true,
          cache: false,
          url: '/stats',
          views: {
            'tab-view': {
              templateUrl: 'templates/tap.stats.html',
            },
          },
        })
        .state('app.tap.edit', {
          authenticate: true,
          cache: false,
          url: '/edit',
          views: {
            'tab-view': {
              templateUrl: 'templates/new-tap.html',
              controller: 'NewTapCtrl',
            },
          },
        })
        .state('app.tap.set-beverage', {
          authenticate: true,
          cache: false,
          url: '/set-beverage',
          views: {
            'tab-view': {
              templateUrl: 'templates/tap-set-beverage.html',
              controller: 'TapSetBeverageCtrl',
            },
          },
        })
        .state('app.tap.set-sensor', {
          authenticate: true,
          cache: false,
          url: '/set-sensor',
          views: {
            'tab-view': {
              templateUrl: 'templates/tap-set-sensor.html',
              controller: 'TapSetSensorCtrl',
            },
          },
        })
        .state('app.keg', {
          authenticate: true,
          cache: false,
          url: '/tap/:kegId',
          views: {
            menuContent: {
              templateUrl: 'templates/keg.html',
              controller: 'KegCtrl',
            },
          },
        })
        .state('app.homebrew', {
          authenticate: true,
          cache: false,
          url: '/homebrews',
          views: {
            menuContent: {
              templateUrl: 'templates/beverage/beverages.html',
              controller: 'BeveragesCtrl',
            },
          },
        })
        .state('app.homebrew-details', {
          authenticate: true,
          cache: false,
          url: '/homebrews/:beverageId',
          views: {
            menuContent: {
              templateUrl: 'templates/beverage/beverage.html',
              controller: 'BeverageCtrl',
            },
          },
        })
        .state('app.new-homebrew', {
          authenticate: true,
          cache: false,
          url: '/homebrews/new',
          views: {
            menuContent: {
              templateUrl: 'templates/beverage/new-beverage.html',
              controller: 'NewBeverageCtrl',
            },
          },
        })
        .state('app.edit-homebrew', {
          authenticate: true,
          cache: false,
          url: '/homebrews/:beverageId',
          views: {
            menuContent: {
              templateUrl: 'templates/beverage/new-beverages.html',
              controller: 'NewBeveragesCtrl',
            },
          },
        })
        .state('app.write-tags', {
          url: '/write-tags',
          authenticate: true,
          views: {
            menuContent: {
              templateUrl: 'templates/write-tags.html',
              controller: 'WriteTagsCtrl',
            },
          },
        })
        .state('app.settings', {
          url: '/settings',
          authenticate: true,
          cache: false,
          views: {
            menuContent: {
              templateUrl: 'templates/settings.html',
              controller: 'SettingsCtrl',
            },
          },
        })
        .state('app.edit-schedule', {
          authenticate: true,
          cache: false,
          url: '/schedules/:scheduleId/edit',
          views: {
            menuContent: {
              templateUrl: 'templates/new-schedule.html',
              controller: 'NewScheduleCtrl',
            },
          },
        })
        .state('app.schedule', {
          authenticate: true,
          cache: false,
          url: '/schedules/:scheduleId',
          views: {
            menuContent: {
              templateUrl: 'templates/schedule.html',
              controller: 'ScheduleCtrl',
            },
          },
        });

      if (ionic.Platform.noScroll()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
      }

      if (typeof PushNotification !== 'undefined') {
        var push = PushNotification.init({
          android: {
            senderID: '12345679',
          },
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false',
          },
          windows: {},
        });

        push.on('registration', function(data) {
          console.log(data.registrationId);
        });

        push.on('notification', function(data) {
          console.log(data.message);
          console.log(data.title);
          console.log(data.count);
          console.log(data.sound);
          console.log(data.image);
          console.log(data.additionalData);
        });
      }
    },
  ]);
