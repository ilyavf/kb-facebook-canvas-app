'use strict';

angular.module('myappApp')
    .controller('Step4Ctrl', function($scope, FriendObjects, FriendReceivers, requestObject) {
        console.log('Step 4');
        $scope.selectedObject = requestObject.object.name;
        $scope.recipients = requestObject.recipients = _.where(FriendReceivers, {selected:true});
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
