'use strict';

angular.module('myappApp')
    .factory('SendReminder', function (SendRequest, CurrentUser) {
        return function (user, object) {
            console.log('[SendRequest]', user, object);
            // send emails:
            var sentPromise = SendRequest({
                sender: CurrentUser.info,
                object: object,
                message: "Reminder",
                recipients: [user]
            });

            return sentPromise;
        };
    });
