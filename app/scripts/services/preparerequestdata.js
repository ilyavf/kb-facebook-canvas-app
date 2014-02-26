'use strict';

angular.module('myappApp')
    .service('PrepareRequestData', function PrepareRequestData(CurrentUser, requestObject) {
        return function prepareRequestData() {
            var currentUserInfo = _.pick(CurrentUser.info, 'id', 'name', 'username'),
                rsubject = [requestObject.subject]
                    .map(function (subject) {
                        var mapped = {
                            name: subject.name,
                            id: subject.id,
                            type: subject.type
                        };
                        if (subject.relationship) mapped.relationship = subject.relationship;
                        return mapped;
                    })[0],
                recipients = requestObject.recipients
                    .filter(function (u) { return !u.notification_sent;})
                    .map(function (user) {
                        return {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            relationship: user.relationship
                        };
                    });

            return {
                currentUserInfo: currentUserInfo,
                rsubject: rsubject,
                recipients: recipients
            };
        }
    });
