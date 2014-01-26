'use strict';

angular.module('myappApp')
    .controller('Step1Ctrl', function ($scope) {
        console.log('Step 1');
        $scope.$emit('wizardInactive');
        $scope.$emit('changeFlow', 'sender');
        $scope.nav1State = 'active';
        $scope.isEventMsgShown = false;
        $scope.showEventMsg = function () {
            $scope.isEventMsgShown = !$scope.isEventMsgShown;
        };
    });
