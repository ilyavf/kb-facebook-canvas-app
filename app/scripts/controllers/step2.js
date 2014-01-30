'use strict';

angular.module('myappApp')
    .controller('Step2Ctrl', function($scope, FriendObjects, requestObject) {
        $scope.subjectType = requestObject.type;
        console.log('Step 2 ' + requestObject.type, $scope.subjectType);
        $scope.friends = FriendObjects;
        $scope.singleSelect = function (friend) {
            $scope.invalidInput = '';
            angular.forEach($scope.friends, function (f) {
                f.selected = false;
            });
            friend.selected = true;
            requestObject.subject = friend;
        };
        $scope.$emit('wizardActive');
        $scope.nav1State = 'passed';
        $scope.nav2State = 'active';
        $scope.nextIfValid = function ($event) {
            if (!requestObject.subject) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-input';
            }
        }
    });
