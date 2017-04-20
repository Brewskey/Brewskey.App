// Ionic Starter App

angular.module('brewskey.services').factory('utils', [
  function() {
    return {
      filterErrors: function(error) {
        if (error && error.data && error.data.ModelState) {
          return _.mapValues(error.data.ModelState, function(values, key) {
            return _.uniq(values);
          });
        } else if (error && error.data && error.data['error_description']) {
          return { generic: error.data['error_description'] };
        } else if (error && error.data && error.data['Message']) {
          return { generic: error.data['Message'] };
        } else {
          return {
            generic: "Whoa! Brewskey had an error.  We'll try to get it fixed soon.",
          };
        }
      },
    };
  },
]);
