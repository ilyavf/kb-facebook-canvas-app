'use strict';

angular.module('myappApp')
    .factory('UserRequests', function($q, CurrentUser) {
        var deferred = $q.defer();
        return function () {
            CurrentUser.$getFire().then(function ($fire) {
                deferred.resolve($fire.$child('sent'));
            });
            return deferred.promise;
        };
    });
