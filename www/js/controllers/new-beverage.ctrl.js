angular.module('brewskey.controllers').controller('NewBeverageCtrl', [
  '$scope',
  'Restangular',
  '$stateParams',
  '$state',
  'utils',
  function($scope, rest, $stateParams, $state, utils) {
    $scope.loaded = false;
    var beverageId = $stateParams.beverageId;

    $scope.beverageTypes = [
      { name: 'Beer', value: 0 },
      { name: 'Coffee', value: 1 },
      { name: 'Soda', value: 2 },
      { name: 'Cider', value: 3 },
    ];

    $scope.servingTemperatures = [
      { name: 'Very Cold - (0-4C/32-39F)', value: 'very_cold' },
      { name: 'Cold - (4-7C/39-45F)', value: 'cold' },
      { name: 'Cool - (8-12C/45-54F)', value: 'cool' },
      { name: 'Cellar - (12-14C/54-57F)', value: 'cellar' },
      { name: 'Warm - (14-16C/57-61F)', value: 'warm' },
      { name: 'Hot - (70C/158F)', value: 'hot' },
    ];

    var currentYear = new Date().getFullYear() + 1, years = [];
    var endYear = currentYear - 10;

    while (endYear <= currentYear) {
      years.push(currentYear--);
    }
    $scope.years = years;

    $scope.model = {
      srmId: 1,
    };

    if (beverageId) {
      rest
        .one('api/v2/beverages(' + beverageId + ')')
        .get()
        .then(function(response) {
          $scope.model = response;
          $scope.loaded = true;
        });
    } else {
      $scope.loaded = true;
    }

    rest.one('api/v2/beverage-availabilities').get().then(function(response) {
      $scope.availabilities = response.value;
    });
    rest.one('api/v2/beverage-glasses').get().then(function(response) {
      $scope.glasses = response.value;
    });
    $scope.styles = [];
    rest.one('api/v2/beverage-styles').get().then(function(response) {
      $scope.styles = $scope.styles.concat(response.value);
    });
    // Pretty hacky but there's only 170 styles right now
    rest
      .one('api/v2/beverage-styles')
      .get({ $skip: 100 })
      .then(function(response) {
        $scope.styles = $scope.styles.concat(response.value);
      });
    rest.one('api/v2/beverage-srms').get().then(function(response) {
      $scope.srms = response.value;
    });

    $scope.sending = false;
    $scope.submitForm = function() {
      $scope.editing = true;

      var promise;

      if (!$scope.model.id) {
        promise = rest.all('api/v2/beverages').post($scope.model);
      } else {
        promise = $scope.model.put();
      }

      promise.then(
        function(response) {
          $scope.editing = false;

          $state.go('app.homebrew', { beverageId: response.id });
        },
        function(error) {
          $scope.editing = false;
          utils.filterErrors(error);
        }
      );
    };

    $scope.getBeerColor = function() {
      var srmId = parseInt($scope.model.srmId, 10);
      var srms = $scope.srms || [];
      var srm = srms.find(function(s) {
        return s.id === srmId;
      }) || { hex: 'FFE699' };
      return {
        color: srmId > 9 ? '#fff' : '',
        'background-color': '#' + srm.hex,
      };
    };
  },
]);
