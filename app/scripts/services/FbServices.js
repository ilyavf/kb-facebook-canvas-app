'use strict';

angular.module('myappApp')
    .factory('FbServices', function ($q) {
        var APP_URL_REQUEST = 'https://apps.facebook.com/kooboodle/?user={user_id}&requestsubject={subject_id}';

        // Public API here
        return {
            requestMsg: function (userId, subjectId) {
                var deferred = $q.defer(),
                    promise = deferred.promise,
                    urlFbApp = APP_URL_REQUEST
                        .replace('{user_id}', userId)
                        .replace('{subject_id}', subjectId),
                    urlDirect = 'https://testb.kooboodle.com/_fb/canvas_app/';

                FB.ui({
                    method: 'send',
                    to: userId,
                    link: urlFbApp
                }, function (response) {
                    // no response according to https://developers.facebook.com/docs/reference/dialogs/send/
                    console.log('[FbServices.requestMsg] resolved. Sent to ' + userId + ', link: ' + urlFbApp, response);
                    var result = response && response.success ? 'success' : 'error';
                    deferred.resolve({
                        status:  result,
                        msg: ''
                    });
                });

                return promise;
            }
        };
    });
