angular.module('brewskey.controllers')
.controller('HomeCtrl', ['$scope', 'Restangular', 'converter', '$localStorage', 'cache', '$timeout',
function ($scope, rest, converter, $storage, cache, $timeout) {
    var startTime;
    var page;
    var allLoaded = false;

    $scope.initialLoad = true;

    function load() {
        if (allLoaded) {
            return;
        }

        $scope.loading = true;

        rest.one('api/feed').get({ startTime: startTime, page: page })
            .then(function (result) {
                $scope.pourEvents = $scope.pourEvents.concat(result);

                allLoaded = result.length < 20;
            })
            .catch(function () {
                allLoaded = true;
            })
            .finally(function () {
                $scope.initialLoad = false;
                $scope.$broadcast('scroll.resize');

                // Stop the ion-refresher from spinning
                $timeout(function () {
                    $scope.loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 100);
            });
    }

    $scope.refresh = function () {
        page = 0;
        startTime = new Date();
        $scope.pourEvents = [];
        load();
    };
    $scope.refresh();
    
    $scope.normalize = converter.normalize;

    $scope.renderUserName = function (userName) {
        return userName === $storage.authDetails.userName ? "You" : userName;
    };
    $scope.moreDataCanBeLoaded = function () {
        return !$scope.loading && !allLoaded;
    };
    $scope.loadMore = function () {
        if ($scope.loading) {
            return;
        }

        page++;

        load();
    };

    $scope.cacheBuster = cache.value;
}]);