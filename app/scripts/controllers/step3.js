'use strict';

angular.module('myappApp')
    .controller('Step3Ctrl', function($scope, FriendObjects, FriendReceivers, requestObject) {
        console.log('Step 3');
        //$scope.selectedObject = _.reduce(FriendObjects, function(m, x){ return m +  (x.selected ? x.name : '')}, '');
        $scope.selectedSubject = requestObject.subject.name;
        $scope.friends = FriendReceivers;
        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'active';
        $scope.nextIfValid = function ($event) {
            if (_.where($scope.friends, {selected: true}).length === 0) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-text';
            }
        }
        $scope.clearValidation = function () {
            $scope.invalidInput = '';
        }
    });
