'use strict';

angular.module('myappApp')
  .factory('MyFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      get: function () {
        return meaningOfLife;
      }
    };
  });
