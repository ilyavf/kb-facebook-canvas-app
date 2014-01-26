'use strict';

angular.module('myappApp')
    .controller('Step2Ctrl', function($scope, FriendObjects, requestObject) {
        console.log('Step 2');
        requestObject.type = 'friend';
        $scope.friends = FriendObjects;
        $scope.singleSelect = function (friend) {
            $scope.invalidInput = '';
            angular.forEach($scope.friends, function (f) {
                f.selected = false;
            });
            friend.selected = true;
            requestObject.object = friend;
        };
        $scope.$emit('wizardActive');
        $scope.nav1State = 'passed';
        $scope.nav2State = 'active';
        $scope.nextIfValid = function ($event) {
            if (!requestObject.object) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-input';
            }
        }
    });
