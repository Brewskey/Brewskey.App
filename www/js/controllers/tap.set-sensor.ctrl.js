angular.module('brewskey.controllers').controller('TapSetSensorCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$state',
  '$ionicHistory',
  '$ionicScrollDelegate',
  function($scope, rest, $stateParams, $state, $ionicHistory, $ionicScrollDelegate) {
    $scope.sensors = [
      {
        name: 'Titan 300',
        description: 'The Brewskey standard flow sensor.',
        value: 4,
        defaultPulses: 5375,
        image: 'titan.png',
        serverEnum: 'Titan',
      },
      {
        name: 'FT330',
        description: 'Very accurate sensor.',
        value: 1,
        defaultPulses: 10313,
        image: 'ft330.png',
        serverEnum: 'FT330',
      },
      {
        name: 'SF800',
        description: 'Very accurate but uses BSP pipe threading.',
        value: 2,
        defaultPulses: 20820,
        image: 'sf800.png',
        serverEnum: 'SwissFlowSF800',
      },
      {
        name: 'YF-201',
        description: 'Cheap sensor with lower accuracy.',
        value: 3,
        defaultPulses: 3785,
        image: 'yf-201.png',
        serverEnum: 'Sea',
      },
      {
        name: 'Custom',
        description: 'Roll your own!',
        value: 0,
        defaultPulses: 0,
        image: null,
        serverEnum: 'Custom',
      },
    ];

    $scope.model = {
      currentSensor: null, //$scope.sensors[0],
      percentage: 0,
    };

    $scope.sensorChanged = function(sensor) {
      $scope.scrollToImage();
      $scope.model.percentage = 0;
    };

    $scope.calculatePercentage = function() {
      return $scope.model.percentage * 0.1;
    };

    $scope.scrollToImage = function () {
      var position = $('#currentImage').offset()
      $ionicScrollDelegate.scrollTo(0, position.top - 43, true);
    };

    $scope.calculatePulses = function() {
      if (!$scope.model.currentSensor) {
        return;
      }

      var defaultPulses = $scope.model.currentSensor.defaultPulses;
      return Math.round(
        defaultPulses + defaultPulses * $scope.calculatePercentage() * 0.01
      );
    };
    $scope.loading = true;
    rest.one('api/taps', $stateParams.tapId).get().then(function(response) {
      if (!response.flowSensorId) {
        $scope.loading = false;
        return;
      }

      $scope.tap = response;

      rest
        .one('api/v2/flow-sensors(' + response.flowSensorId + ')')
        .get()
        .then(function(response) {
          $scope.loading = false;
          $scope.model.id = response.id;
          $scope.model.currentSensor =
            $scope.sensors.find(function(sensor) {
              return sensor.serverEnum === response.flowSensorType;
            }) || $scope.sensors[0];

          var decimalPercentage =
            response.pulsesPerGallon / $scope.model.currentSensor.defaultPulses;

          if (response.flowSensorType !== 'Custom') {
            $scope.model.percentage = -1000 * (1 - decimalPercentage);
          } else {
            $scope.model.customPulses = response.pulsesPerGallon;
          }
        });
    });

    $scope.editing = false;
    $scope.submitForm = function() {
      $scope.model.tapId = $scope.tap.id;
      $scope.editing = true;
      var currentSensor = $scope.model.currentSensor;

      rest
        .all('api/v2/flow-sensors')
        .post({
          flowSensorType: currentSensor.value,
          pulsesPerGallon: currentSensor.serverEnum !== 'Custom'
            ? $scope.calculatePulses()
            : $scope.model.customPulses,
          tapId: $stateParams.tapId,
        })
        .then(function(response) {
          if ($scope.tap.currentKeg) {
            $ionicHistory.goBack();
          } else {
            $ionicHistory.currentView($ionicHistory.backView());
            $state.go(
              'app.tap.set-beverage',
              { tapId: $stateParams.tapId },
              { location: 'replace' }
            );
          }
        });
    };

    $scope.cancel = function() {
      $ionicHistory.currentView($ionicHistory.backView());
      $state.go(
        'app.tap.edit',
        { tapId: $stateParams.tapId },
        { location: 'replace' }
      );
    };
  },
]);
