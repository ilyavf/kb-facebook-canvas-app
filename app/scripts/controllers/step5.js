'use strict';

angular.module('myappApp')
    .controller('Step5Ctrl', function($scope, FriendObjects, FriendReceivers, GetUser, CurrentUser, SendRequest, requestObject) {
        console.log('Step 5');

        $scope.selectedSubject = _.reduce(FriendObjects, function(m, x){ return m +  (x.selected ? x.name : '')}, '');
        $scope.recipients = _.map(requestObject.recipients, function (o) { return o.name;}).join(', ');

        $scope.isValid = true;

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
                .map(function (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        relationship: user.relationship
                    };
                });

        if (!rsubject || recipients.length === 0) {
            $scope.isValid = false;
            return;
        }

        setTimeout(function () {
            $scope.$apply(function () {
                $scope.$emit('wizardInactive');
            });
        }, 3000);

        var request = CurrentUser.$fire.$child('sent').$child(rsubject.id),
            requestRecipients = request.$child('recipients');

        request.$child('date').$set(new Date().toJSON());
        request.$child('subject').$set(rsubject);
        request.$child('type').$set(rsubject.type);

        recipients
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

        recipients.forEach(function (recipient) {
            var user = GetUser(recipient.id);
            if (!user.info) {
                user.child('info').set( {id: recipient.id, name: recipient.name, username: recipient.username} );
            }
            user.child('received').child(rsubject.id).set({
                subject: rsubject,
                sender: currentUserInfo,
                status: 'pending'
            });
        });

        // send emails:
        var sentPromise = SendRequest({
            sender: currentUserInfo,
            subject: rsubject,
            message: requestObject.message,
            type: 'request',
            recipients: recipients
        });

        sentPromise.then(function () {
            console.log('[Step5.sentPromise]: ', arguments);
        });
    });
