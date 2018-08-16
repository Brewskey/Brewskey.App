angular.module('brewskey.services').factory('modal', [
  '$ionicPopup',
  'Restangular',
  function($ionicPopup, rest) {
    return {
      delete: function(entityType, apiUrl, entity, onOpen) {
        return $ionicPopup
          .confirm({
            cssClass: 'text-center green-popup',
            title: 'Delete ' + entityType,
            template: 'Are you sure you want to delete ' + entity.name + '?'
          })
          .then(function(result) {
            if (!result) {
              return;
            }

            onOpen && onOpen();

            rest
              .one(apiUrl, apiUrl.indexOf(entity.id) >= 0 ? '' : entity.id)
              .remove();

            return result;
          });
      }
    };
  }
]);
