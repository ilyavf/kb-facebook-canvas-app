'use strict';

angular.module('myappApp')
    .controller('Step1Ctrl', function ($scope, requestObject) {
        console.log('Step 1');
        $scope.$emit('wizardInactive');
        $scope.$emit('changeFlow', 'sender');
        $scope.nav1State = 'active';
        $scope.isEventMsgShown = false;
        $scope.setType = function (type) {
            requestObject.type = type;
        };
    });
