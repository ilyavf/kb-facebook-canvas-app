'use strict';

angular.module('myappApp')
    .factory('SendReminder', function ($q, SendRequest, CurrentUser) {
        return function (user, subject) {
            var deferred = $q.defer();

            console.log('[SendRequest]', user, subject);
            // send notifications:
            CurrentUser.getInfo()
                .then(function (info) {
                    return SendRequest({
                        sender: info,
                        subject: subject,
                        message: "Reminder",
                        recipients: [user]
                    });
                })
                .then(function (response) {
                    deferred.resolve(response);
                })
                .catch(function (response) {
                    deferred.resolve(response);
                });

            return deferred.promise;
        };
    });
