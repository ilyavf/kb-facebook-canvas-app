'use strict';

angular.module('myappApp')
    .controller('Step3Ctrl', function Step3Ctrl(
        $scope, $location, $window, FriendReceivers, FriendObjects, requestObject, PrepareRequestData, SaveRequestData, SendRequest
    ) {
        if (!requestObject.recipients.length) {
            console.log('- resetting recipients in friends array', requestObject);
            FriendReceivers.then(function (friends) {
                friends.reset();
            });
        }
        $scope.$emit('wizardActive');

        if (requestObject.type == 'myself') {
            requestObject.type = 'friend';
            FriendObjects.then(function (friends) {
                friends.reset();
                friends[0].selected = true;
                requestObject.subject = friends[0];
                requestObject.subject.type = 'friend';
            });
        }

        FriendReceivers.then(function (friends) {
            $scope.friends = friends;

            //$scope.onlyRelevantFriends
            //? FriendReceivers.filter(function (f) { return f.taggedMe; })
            //: FriendReceivers;
        });

        console.log('Step 3');
        $scope.onlyRelevantFriends = requestObject.subject.relationship == 'myself' ? true : false;

        $scope.selectedSubject = requestObject.subject.name;
        $scope.placeholder = 'Filter';
        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'active';
        $scope.nextBtnLoading = false;

        $scope.nextIfValid = function ($event) {
            if ($scope.nextBtnLoading) {
                $event.preventDefault();
                console.log('... in process ...');
                return false;
            }

            $scope.save();
            if (requestObject.recipients.length === 0) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-text';
                console.log('[nextIfValid] not valid: ' + requestObject.recipients.length, requestObject);
            } else {
                var requestData = PrepareRequestData();

                if (requestData.recipients.length === 0) {
                    console.log('- all requests already sent');
                    $location.path('/step4');
                    return;
                }

                $scope.nextBtnLoading = true;

                // send FB notifications/emails:
                SendRequest({
                    sender: requestData.currentUserInfo,
                    subject: requestData.rsubject,
                    type: 'request',
                    recipients: requestData.recipients
                }).then(function (response) {
                    var data;
                    try {
                        data = JSON.parse(response.data.replace(/([^\}]*)$/g, ''));
                    } catch (e) {
                        console.log('*** Error *** unexpected answer from server', arguments);
                    }

                    if (data && data.notification_sent) {
                        $scope.markUsers(requestObject.recipients, data.notification_sent);
                        $scope.markUsers(requestData.recipients, data.notification_sent);
                    }

                    //TODO: convert to a promise:
                    SaveRequestData(requestData);

                    console.log('[SendRequest promise resolved]', arguments);

                    $location.path('/step4');
                }, function (response) {
                    console.log('*** ERROR *** failed to send FB requests', arguments);
                    $window.alert("System Error\n\nThere was an error while trying to send requests to Facebook."
                        + "\n\nStatus: " + response.status
                        + "\nMsg: " + response.data);

                    //$scope.markUsers(requestObject.recipients, [{id: '100004353247811'}]);
                    //$location.path('/step4');

                    $scope.nextBtnLoading = false;
                });
            }
        };
        $scope.clearValidation = function () {
            $scope.invalidInput = '';
        };
        $scope.save = function () {
            requestObject.recipients = $scope.friends.filter(function (f) {
                return f.selected == true && (!$scope.onlyRelevantFriends || f.taggedMe);
            });
        };

        $scope.markUsers = function (recipients, notification_sent) {

            // mark recipients as KB/non-KB:
            _.each(recipients, function (user) {
                user.notification_sent =  user.notification_sent || _.findWhere(notification_sent, {id: user.id}) ? true : false;
                user.existingUser =  user.notification_sent;
            });

            console.log('Kooboodle users: ' + recipients
                .filter(function(u){ return u.existingUser;})
                .map(function(u){ return u.name;}).join(', ') + '');
            console.log('NON Kooboodle users: ' + recipients
                .filter(function(u){ return !u.existingUser;})
                .map(function(u){ return u.name;}).join(', ') + '');
        }
    });
