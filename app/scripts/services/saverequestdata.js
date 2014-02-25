'use strict';

angular.module('myappApp')
    .service('SaveRequestData', function SaveRequestData(CurrentUser, GetUser) {

        return function (requestData) {
            var request = CurrentUser.$fire.$child('sent').$child(requestData.rsubject.id),
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
                    date: new Date().toJSON()
                };})
                .forEach(function (recipient) {
                    requestRecipients.$child(recipient.id).$set(recipient);
                });

            requestData.recipients.forEach(function (recipient) {
                var user = GetUser(recipient.id);
                if (!user.info) {
                    user.child('info').set( {id: recipient.id, name: recipient.name, username: recipient.username} );
                }
                user.child('received').child(requestData.rsubject.id).set({
                    subject: requestData.rsubject,
                    sender: requestData.currentUserInfo,
                    status: 'pending'
                });
            });
        }
    });
