angular.module('brewskey.services').factory('cache', [
  function() {
    var reset = function() {
      output.value = new Date().getTime();
    };
    var output = {
      reset: reset,
      value: 0
    };
    reset();

    return output;
  }
]);
