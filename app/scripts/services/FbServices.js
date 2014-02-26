'use strict';

angular.module('myappApp')
    .factory('FbServices', function ($q) {

        // Public API here
        return {
            requestMsg: function (userId, subjectId) {
                var deferred = $q.defer(),
                    promise = deferred.promise;

                FB.ui({
                    method: 'send',
                    to: userId,
                    link: 'https://apps.facebook.com/kooboodle/?requestsubject=' + subjectId
                }, function (response) {
                    // no response according to https://developers.facebook.com/docs/reference/dialogs/send/
                    console.log('[FbServices.requestMsg] resolved', response);
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
