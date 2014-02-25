'use strict';

angular.module('myappApp')
    .controller('Step3Ctrl', function($scope, $location, $window, FriendReceivers, requestObject, PrepareRequestData, SaveRequestData, SendRequest) {
        if (!requestObject.recipients.length) {
            console.log('- resetting recipients in friends array', requestObject);
            FriendReceivers.reset();
        }

        console.log('Step 3');

        $scope.selectedSubject = requestObject.subject.name;
        $scope.friends = FriendReceivers;
        $scope.placeholder = 'Filter';
        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'active';
        $scope.nextIfValid = function ($event) {
            $scope.save();
            if (requestObject.recipients.length === 0) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-text';
            } else {
                var requestData = PrepareRequestData();

                // send FB notifications/emails:
                SendRequest({
                    sender: requestData.currentUserInfo,
                    subject: requestData.rsubject,
                    type: 'request',
                    recipients: requestData.recipients
                }).then(function (response) {
                    var data = JSON.parse(response.data.replace(/([^\}]*)$/g, ''));

                    // mark recipients as
                    _.each(requestData.recipients, function (user) {
                        user.notification_sent =  _.findWhere(data.notification_sent, {id: user.id}) ? true : false;
                        user.isFbKooboodleUser =  user.notification_sent;
                    });

                    console.log('Kooboodle users: ' + requestData.recipients
                        .filter(function(u){ return u.isFbKooboodleUser;})
                        .map(function(u){ return u.name;}).join(', ') + '');
                    console.log('NON Kooboodle users: ' + requestData.recipients
                        .filter(function(u){ return !u.isFbKooboodleUser;})
                        .map(function(u){ return u.name;}).join(', ') + '');

                    //TODO: convert to a promise:
                    SaveRequestData(requestData);

                    console.log('[SendRequest promise resolved]', arguments);

                    $location.path('/step4');
                }, function (data) {
                    console.log('*** ERROR *** failed to send FB requests', arguments);
                    $window.alert("System Error\n\nThere was an error while trying to send requests to Facebook."
                        + "\n\nStatus: " + data.status
                        + "\nMsg: " + data.data);
                });
            }
        };
        $scope.clearValidation = function () {
            $scope.invalidInput = '';
        };
        $scope.save = function () {
            requestObject.recipients = _.where(FriendReceivers, {selected:true});
        };
    });
