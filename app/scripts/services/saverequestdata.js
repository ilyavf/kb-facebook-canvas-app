'use strict';

angular.module('myappApp')
    .service('SaveRequestData', function SaveRequestData($q, CurrentUser, GetUser) {

        return function (requestData) {
            var deferred = $q.defer();

            CurrentUser.$getFire().then(function ($fire) {

                var request = $fire.$child('sent').$child(requestData.rsubject.id),
                    requestRecipients = request.$child('recipients');

                request.$child('date').$set(new Date().toJSON());
                request.$child('subject').$set(requestData.rsubject);
                request.$child('type').$set(requestData.rsubject.type);

                requestData.recipients
                    .map(function (i) { return {
                        id: i.id,
                        name: i.name,
                        username: i.username,
                        relationship: i.relationship,
                        status: 'pending',
                        notificationSent: i.notification_sent,
                        existingUser: i.existingUser,
                        date: new Date().toJSON()
                    };})
                    .forEach(function (recipient) {
                        requestRecipients.$child(recipient.id).$set(recipient);
                    });

                requestData.recipients.forEach(function (recipient) {
                    var user = GetUser(recipient.id);
                    if (!user.info) {
                        var infoFire = user.child('info');

                        infoFire.child('id').set(recipient.id);
                        infoFire.child('name').set(recipient.name);
                        infoFire.child('username').set(recipient.username);
                    }
                    user.child('received').child(requestData.rsubject.id).set({
                        subject: requestData.rsubject,
                        sender: requestData.currentUserInfo,
                        status: 'pending'
                    });
                });

                deferred.resolve('OK');
            });

            return deferred.promise;
        }
    });
