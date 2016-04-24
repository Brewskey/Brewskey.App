angular.module('tappt.controllers')
.controller('WriteTagsCtrl', ['$scope', '$stateParams', 'Restangular', 'nfcService', '$ionicPopup',
function ($scope, $stateParams, rest, nfcService, $ionicPopup) {
    $scope.writing = false;

    $scope.writeTags = function () {
        $scope.writing = true;
        rest.one('api/authorizations').post('nfc-tag')
			.then(function (response) {
			    nfcService.writeTag(response)
					.then(function () {
					    $scope.writing = false;
					    $ionicPopup.alert({
					        title: 'Successfully wrote tag!'
					    });
					},
					function () {
					    $scope.writing = false;
					    $ionicPopup.alert({
					        title: 'Error writing Tag!',
					        template: 'Sorry, there was an error when writing your tag.  Please try again later.'
					    });
					});
			});
    };
}]);