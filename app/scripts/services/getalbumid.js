'use strict';

angular.module('myappApp')
    .factory('getAlbumId', function ($q, CreateSharedAlbum, CurrentUser) {
        var deferred = $q.defer(),
            promise = deferred.promise;

        return function (pendingRequest) {
            if (pendingRequest.albumInfo) {
                deferred.resolve(pendingRequest.albumInfo);
            } else {
                CreateSharedAlbum(pendingRequest, function (albumInfo) {
                    deferred.resolve(albumInfo);
                    pendingRequest.albumInfo = albumInfo;
                    //CurrentUser.$fire.$save();
                    CurrentUser.$getFire().then(function ($fire) {
                        $fire.$save();
                    });
                });
            }

            return promise;
        }
    });
