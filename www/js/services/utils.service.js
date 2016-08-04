// Ionic Starter App

angular.module('brewskey.services')
.factory("utils",
  [
  function () {
      return {
          filterErrors: function (error) {
              if (error.data.ModelState) {
                  return _.mapValues(error.data.ModelState, function (values, key) {
                      return _.uniq(values);
                  });
              } else if (error.data['error_description']) {
                  return { generic: error.data['error_description'] };
              }
          }
      }
  }]);
