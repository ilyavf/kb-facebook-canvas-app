'use strict';

angular.module('myappApp')
    .factory('GetPhotoUrlPromise', function ($q) {
        return function (photoId) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            FB.api('/' + photoId, function (response) {
                if (response.picture) {
                    deferred.resolve(response.picture);
                }
            });
            return promise;
        }
    });
