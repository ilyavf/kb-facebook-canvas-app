'use strict';

angular.module('myappApp')
    .controller('Step1Ctrl', function ($scope, requestObject, FriendObjects) {
        console.log('Step 1');
        $scope.$emit('wizardInactive');
        $scope.$emit('changeFlow', 'sender');
        $scope.nav1State = 'active';
        $scope.isEventMsgShown = false;
        $scope.setType = function (type) {
            requestObject.type = type;
            requestObject.subtype = '';
            if (type == 'myself') {
                requestObject.type = 'friend';
                FriendObjects.reset();
                FriendObjects[0].selected = true;
                requestObject.subject = FriendObjects[0];
                requestObject.subject.type = 'friend';
            }
        };
    });
