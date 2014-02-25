'use strict';

angular.module('myappApp')
    .controller('Step4Ctrl', function($scope, requestObject) {
        console.log('Step 4');

        $scope.kbUsers = requestObject.recipients.filter(function(u){ return u.isFbKooboodleUser; });
        $scope.nonKbUsers = requestObject.recipients.filter(function(u){ return !u.isFbKooboodleUser; });

        $scope.kbUsersString = $scope.kbUsers.length > 0 && $scope.kbUsers.map(function(u){ return u.name; }).join(', ').replace(/\,([^\,]*)$/, ' and $1');
        $scope.nonKbUsersString = $scope.nonKbUsers.length > 0 && $scope.nonKbUsers.map(function(u){ return u.name; }).join(', ').replace(/\,([^\,]*)$/, ' and $1');

        $scope.selectedSubject = requestObject.subject.name;

        $scope.done = $scope.nonKbUsers.length === 0 ? true : false;

        $scope.nextIfValid = function ($event) {
            if (!$scope.done) {
                $event.preventDefault();
                return false;
            }
        };

        $scope.sendMessage = function (userId) {
            var user = requestObject.recipients.filter(function (u) { return u.id == userId;})[0];

            if (user.length == 0 || user.msgSent) {
                return;
            }

            user.msgSent = true;

            $scope.done = true;

            //TODO: move to a separate service:
            FB.ui({
                method: 'send',
                to: userId,
                link: 'https://apps.facebook.com/kooboodle/?requestsubject' + requestObject.subject.id
            });
        };


        /*$scope.emailSubject = CurrentUser.info.name + ' asked you to upload photos of ' + requestObject.subject.name;
        $scope.recipients = requestObject.recipients;
        $scope.remove = function (friend) {
            friend.selected = false;
            $scope.recipients.splice($scope.recipients.indexOf(friend), 1);
        };
        $scope.message = requestObject.message;
        $scope.saveMessage = function () {
            requestObject.message = $scope.message;
        };
        $scope.placeholderValue = 'Enter your message here (optional)';
        $scope.placeholder = $scope.placeholderValue;*/


        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'passed';
        $scope.nav4State = 'active';
    });
