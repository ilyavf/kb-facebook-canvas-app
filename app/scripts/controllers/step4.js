'use strict';

angular.module('myappApp')
    .controller('Step4Ctrl', function($scope, CurrentUser, FriendObjects, requestObject) {
        console.log('Step 4');
        $scope.selectedSubject = requestObject.subject.name;
        $scope.emailSubject = CurrentUser.info.name + ' asked you to upload photos of ' + requestObject.subject.name;
        $scope.recipients = requestObject.recipients;
        $scope.remove = function (friend) {
            friend.selected = false;
            $scope.recipients.splice($scope.recipients.indexOf(friend), 1);
        };
        $scope.message = requestObject.message;
        $scope.saveMessage = function () {
            requestObject.message = $scope.message;
        };
        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'passed';
        $scope.nav4State = 'active';
    });
