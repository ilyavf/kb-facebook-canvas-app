'use strict';

angular.module('myappApp')
    .controller('Step3Ctrl', function Step3Ctrl(
        $scope, $location, $window, $q,
        CurrentUser, FriendReceivers, FriendObjects, requestObject, PrepareRequestData, SaveRequestData, SendRequest
    ) {
        if (!requestObject.recipients.length) {
            console.log('- resetting recipients in friends array', requestObject);
            FriendReceivers.then(function (friends) {
                friends.reset();
            });
        }
        $scope.$emit('wizardActive');


        $scope.onlyRelevantFriends = requestObject.subject.relationship == 'myself' ? true : false;
        console.log('Step 3:');

        if (requestObject.type == 'myself') {
            requestObject.type = 'friend';
            $q.all({
                user: CurrentUser.getInfo(),
                friends: FriendObjects
            })
            .then(function (resolved) {
                var currentUserInfo = resolved.user,
                    friends = resolved.friends,
                    currentUser = friends.reduce(function(prev,cur){ return cur.id == currentUserInfo.id ? cur : prev }, {});

                friends.reset();
                currentUser.selected = true;
                requestObject.subject = currentUser;
                requestObject.subject.type = 'friend';
                $scope.selectedSubject = requestObject.subject.name;
                $scope.onlyRelevantFriends = requestObject.subject.relationship == 'myself' ? true : false;
                console.log('- friends resolved: ' + requestObject.subject.relationship, requestObject.subject);
            });
        }

        FriendReceivers.then(function (friends) {
            $scope.friends = friends;

            //$scope.onlyRelevantFriends
            //? FriendReceivers.filter(function (f) { return f.taggedMe; })
            //: FriendReceivers;
        });

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
                console.log('- preparing request data...');
                $scope.nextBtnLoading = true;

                PrepareRequestData().then(function (requestData) {
                    console.log('[nextIfValid] data is ready', requestData);

                    if (requestData.recipients.length === 0) {
                        console.log('- all requests already sent');
                        $location.path('/step4');
                        return;
                    }

                    // send FB notifications/emails:
                    console.log('- sending requests to FB...');
                    SendRequest({
                        sender: requestData.currentUserInfo,
                        subject: requestData.rsubject,
                        type: 'request',
                        recipients: requestData.recipients
                    })
                    .then(function (response) {
                        var data = response && response.data;

                        //try {
                        //    //OpenPhoto bug: extra symbol in the end - get rid of it:
                        //    data = JSON.parse(response.data.replace(/([^\}]*)$/g, ''));
                        //} catch (e) {
                        //    console.log('*** Error *** unexpected answer from server', arguments);
                        //}

                        if (data && data.notification_sent) {
                            $scope.markUsers(requestObject.recipients, data.notification_sent);
                            $scope.markUsers(requestData.recipients, data.notification_sent);
                        }

                        console.log('[SendRequest promise resolved]. Saving to firebase...', arguments);

                        SaveRequestData(requestData).then(function () {
                            $location.path('/step4');
                        });

                    }, function (response) {
                        console.log('*** ERROR *** failed to send FB requests', arguments);
                        $window.alert("System Error\n\nThere was an error while trying to send requests to Facebook."
                            + "\n\nStatus: " + response.status
                            + "\nMsg: " + response.data);

                        $scope.nextBtnLoading = false;
                    });
                }, function (error) {
                    console.log('Error while trying to prepare request data: ' + error);
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
