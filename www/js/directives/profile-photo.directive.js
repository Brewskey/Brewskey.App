angular.module('tappt.directives')
.directive('profilePhoto', [
'$ionicModal', 'Restangular', '$localStorage',
function ($ionicModal, rest, storage) {
    var index = 0;
    return {
        link: function (scope, element) {
            scope.isUsersProfile = scope.userName === storage.authDetails.userName;
            scope.index = index;
            $ionicModal.fromTemplateUrl('templates/photo-select.html', {
                scope: scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                scope.modal = modal;
            });

            scope.selectPhoto = function () {
                if (typeof navigator.camera === "undefined") {
                    return;
                }

                navigator.camera.getPicture(function (image) {
                    scope.image = image;
                    scope.$apply();
                }, function (error) {
                    scope.showError = true;
                }, {
                    destinationType: Camera.DestinationType.DATA_URL,
                    cameraDirection: Camera.Direction.FRONT,
                    saveToPhotoAlbum: false,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                });
            }

            scope.openModal = function () {
                scope.modal.show();
            };

            scope.$on('modal.shown', function () {
                scope.selectPhoto();
            });

            scope.savePhoto = function () {
                rest.one("api/profile").customPUT({ photo: scope.image }, "photo").then(function () {
                    scope.closeModal();
                }).catch(function (e) {
                    var v = 0;
                });
            };

            scope.closeModal = function () {
                scope.image = null;
                index = scope.index = index + 1;
                scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            scope.$on('$destroy', function () {
                scope.modal.remove();
            });
        },
        scope: {
            userName: '=',
        },
        templateUrl: 'templates/profile-photo.html',
    };
}]);



