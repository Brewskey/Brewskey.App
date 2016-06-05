angular.module('brewskey.controllers')
.controller('AccountsCtrl', ['$scope', '$localStorage', '$ionicModal', 'achievements',
function ($scope, $storage, $ionicModal, achievements) {
    var setup = function() {
        $scope.accounts = $storage.authList;
        $scope.currentUsername = $storage.authDetails.userName;
        $scope.loginData = {};
    };
    setup();
    $scope.$on('modal.hidden', setup);

    $scope.accountSelected = function (account) {
        achievements.unsubscribe($scope.currentUsername);
        $storage.authDetails = account;
        $scope.currentUsername = account.userName;
        achievements.subscribe($scope.currentUsername);

        $scope.$emit('userChanged', account);
    };
    $scope.removeAccount = function(account) {
        $scope.accounts = $storage.authList = _.filter($scope.accounts, function(a) {
            return a !== account;
        });
    };

    $scope.showLogin = function($event) {
        $scope.modal.show($event);
    };
    $ionicModal.fromTemplateUrl('templates/login.modal.html', {
        animation: 'slide-in-up',
        scope: $scope,
    }).then(function (modal) {
        $scope.modal = modal;
    });
}]);
