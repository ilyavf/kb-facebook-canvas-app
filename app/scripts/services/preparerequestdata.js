'use strict';

angular.module('myappApp')
    .service('PrepareRequestData', function PrepareRequestData($q, CurrentUser, requestObject) {
        return function prepareRequestData() {

            var deferred = $q.defer();

            console.log('[PrepareRequestData] requires current user info...');
            CurrentUser.getInfo().then(function (info) {

                console.log('[PrepareRequestData] received info, processing...', info);
                var currentUserInfo = _.pick(info, 'id', 'name', 'username'),
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

                console.log('[PrepareRequestData] resolving deferred...');
                deferred.resolve({
                    currentUserInfo: currentUserInfo,
                    rsubject: rsubject,
                    recipients: recipients
                });
            }, function (error) {
                console.log('[PrepareRequestData] rejecting deferred due to ' + error);
                deferred.reject(error);
            });


            return deferred.promise;
        }
    });
