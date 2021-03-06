'use strict';

angular.module('myappApp')
    .factory('CreateSharedAlbum', function () {
        return function (pendingRequest, callback) {
            var albumInfo, // = '263902453764861',
                subjectName = pendingRequest.subject.name,
                shareWithUserId = pendingRequest.sender.id,
                shareWithUserName = pendingRequest.sender.name,
                params = {
                    name: 'Photos of ' + subjectName + ' shared with ' + shareWithUserName + ' via Kooboodle',
                    privacy: {
                        'value': 'CUSTOM',
                        'allow': shareWithUserId
                    }
                };

            FB.api('/me/albums', 'post', params, function (response) {
                console.log('FB me albums', params, response);
                if (response.id) {
                    FB.api('/' + response.id, function (albumData) {
                        callback(albumData);
                    });
                } else {
                    console.log('ERROR: could not create an album: ', response);
                }
            });
        }
    });
