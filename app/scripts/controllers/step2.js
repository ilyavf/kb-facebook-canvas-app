'use strict';

angular.module('myappApp')
    .controller('Step2Ctrl', function($scope, FriendObjects, requestObject) {
        if (!requestObject.subject.name || requestObject.type !== 'friend') {
            console.log('- resetting subject in friends array');
            FriendObjects.reset();
        }
        $scope.placeholderValue = requestObject.type === 'friend' ? "Your name or friend's name" : 'e.g. "Trip to France", "The Eiffel Tower", "Christmas"';
        $scope.placeholder = $scope.placeholderValue;
        $scope.hidePlaceholder = function () {
            $scope.placeholder = '';
        }
        $scope.showPlaceholder = function () {
            $scope.placeholder = $scope.placeholderValue;
        }
        $scope.subjectType = requestObject.type;
        $scope.subjectEvent = requestObject.subject;
        console.log('Step 2 ' + requestObject.type);
        $scope.friends = FriendObjects;
        $scope.singleSelect = function (friend) {
            $scope.invalidInput = '';
            angular.forEach($scope.friends, function (f) {
                f.selected = false;
            });
            friend.selected = true;
            requestObject.subject = friend;
            requestObject.subject.type = 'friend';
        };
        $scope.$emit('wizardActive');
        $scope.nav1State = 'passed';
        $scope.nav2State = 'active';
        $scope.nextIfValid = function ($event) {
            console.log('Validation: ' + $scope.subjectType + ' ' + $scope.subjectEvent);
            if ($scope.subjectType === 'event') {
                if (!$scope.subjectEvent.name.trim()) {
                    requestObject.subject = null;
                } else {
                    var eventName = $scope.subjectEvent.name.replace(/[^A-Za-z0-9_\-\s]/g,'')
                    requestObject.subject = {
                        name: eventName,
                        id: eventName.replace(/\s/g, '+'),
                        type: $scope.subjectType
                    };
                }
            }
            if (!requestObject.subject) {
                console.log('Validation error ' + requestObject.subject, requestObject.subject);
                $event.preventDefault();
                $scope.invalidInput = 'animate-invalid-input';
            }
        }
    });
