'use strict';

angular.module('myappApp')
    .factory('SendReminder', function (SendRequest, CurrentUser) {
        return function (user, subject) {
            console.log('[SendRequest]', user, subject);
            // send emails:
            var sentPromise = SendRequest({
                sender: CurrentUser.info,
                subject: subject,
                message: "Reminder",
                recipients: [user]
            });

            return sentPromise;
        };
    });
