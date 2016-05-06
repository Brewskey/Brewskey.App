angular.module('brewskey.directives')
    .directive('kegModify', [
    'Restangular', '$ionicModal', 'kegTypes',
    function (rest, $ionicModal, kegTypes) {
        return {
            link: function (scope, element) {
                scope.kegTypes = kegTypes;
                scope.model = scope.model || {}

                scope.$watch('query', function (val) {
                    scope.selectedBeer = null;
                    if (!val) {
                        return;
                    }
                    rest.one('api/beer').customGET('search', { query: val }).then(function (response) {
                        if (!response || !response.data) {
                            return null;
                        }

                        scope.beers = response.data;
                    });
                });

                scope.onSelect = function (selectedBeer) {
                    scope.selectedBeer = selectedBeer;

                    var model = scope.model;
                    model.tapId = scope.tapId;
                    model.beerId = selectedBeer.id;
                    model.beerName = selectedBeer.name;
                    model.beerIcon = (selectedBeer.labels || {}).medium || null;
                    model.changed = true;

                    scope.closeModal();
                };

                scope.onKegTypeChange = function () {
                    var model = scope.model;
                    model.changed = true;
                };

                $ionicModal.fromTemplateUrl('templates/modals/beer-selector.html', {
                    scope: scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    scope.modal = modal;
                });
                scope.openModal = function () {
                    scope.modal.show();
                };
                scope.closeModal = function () {
                    scope.modal.hide();
                };


                scope.editing = true;
                scope.submit = function (shouldReplace) {
                    scope.editing = false;

                    var model = scope.model;
                    model.tapId = scope.tapId;

                    var promise;
                    if (shouldReplace) {
                        promise = rest.all('api/kegs').post(model);
                    } else {
                        promise = rest.restangularizeElement('', model, 'api/kegs').put();
                    }

                    promise.then(function (response) {
                        scope.editing = false;
                        scope.model = response;
                        scope.model.changed = false;
                        scope.onOkay && scope.onOkay(response);
                    }, function (error) {
                        scope.editing = true;
                        if (!error.data) {
                            return;
                        }
                        if (error.data.ModelState) {
                            scope.errors = error.data.ModelState;
                        }
                        if (error.data['error_description']) {
                            scope.errorDescription = error.data['error_description'];
                        }
                        if (error.data.Message) {
                            scope.errorDescription = error.data.Message;
                        }
                    });
                };
            },
            restrict: 'E',
            scope: {
                model: '=keg',
                onCancel: '=onCancel',
                onOkay: '=onOkay',
                tapId: '=tapId',
            },
            templateUrl: 'templates/modify-keg.html',
        };
    }]);
