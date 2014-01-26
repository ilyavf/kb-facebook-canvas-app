'use strict';

angular.module('myappApp')
    .controller('Step5Ctrl', function($scope, FriendObjects, FriendReceivers, GetUser, CurrentUser, SendRequest, requestObject) {
        console.log('Step 5');

        $scope.selectedObject = _.reduce(FriendObjects, function(m, x){ return m +  (x.selected ? x.name : '')}, '');
        $scope.recipients = _.map(requestObject.recipients, function (o) { return o.name;}).join(', ');

        $scope.isValid = true;

        var currentUserInfo = _.pick(CurrentUser.info, 'id', 'name', 'username'),
            rObject = [requestObject.object]
                .map(function (i) {
                    return {
                        name: i.name,
                        id: i.id,
                        type: 'friend'
                    }
                })[0],
            recipients = requestObject.recipients
                .map(function (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        username: user.username
                    };
                });

        if (!rObject || recipients.length === 0) {
            $scope.isValid = false;
            return;
        }

        setTimeout(function () {
            $scope.$apply(function () {
                $scope.$emit('wizardInactive');
            });
        }, 3000);

        var request = CurrentUser.$fire.$child('sent').$child(rObject.id),
            requestRecipients = request.$child('recipients');

        request.$child('date').$set(new Date().toJSON());
        request.$child('object').$set(rObject);
        request.$child('type').$set('friend');

        recipients
            .map(function (i) { return {
                id: i.id,
                name: i.name,
                username: i.username,
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
            user.child('received').child(rObject.id).set({
                object: rObject,
                sender: currentUserInfo,
                status: 'pending'
            });
        });

        // send emails:
        var sentPromise = SendRequest({
            sender: currentUserInfo,
            object: rObject,
            message: requestObject.message,
            recipients: recipients
        });

        sentPromise.then(function () {
            console.log('[Step5.sentPromise]: ', arguments);
        });
    });
