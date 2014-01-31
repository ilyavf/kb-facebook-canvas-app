'use strict';

angular.module('myappApp')
    .controller('Step3Ctrl', function($scope, FriendObjects, FriendReceivers, requestObject) {
        if (!requestObject.recipients.length) {
            console.log('- resetting recipients in friends array', requestObject);
            FriendReceivers.reset();
        }

        console.log('Step 3');
        //$scope.selectedObject = _.reduce(FriendObjects, function(m, x){ return m +  (x.selected ? x.name : '')}, '');
        $scope.selectedSubject = requestObject.subject.name;
        $scope.friends = FriendReceivers;
        $scope.placeholder = 'Filter';
        $scope.nav1State = 'passed';
        $scope.nav2State = 'passed';
        $scope.nav3State = 'active';
        $scope.nextIfValid = function ($event) {
            $scope.save();
            if (requestObject.recipients.length === 0) {
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-text';
            }
        }
        $scope.clearValidation = function () {
            $scope.invalidInput = '';
        }
        $scope.save = function () {
            requestObject.recipients = _.where(FriendReceivers, {selected:true});
        }
    });
