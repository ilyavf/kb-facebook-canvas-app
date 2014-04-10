'use strict';

angular.module('myappApp')
    .controller('Step1Ctrl', function ($scope, requestObject, CurrentUser, FacebookFriends) {
        console.log('Step 1');
        requestObject.reset();
        $scope.$emit('wizardInactive');
        $scope.$emit('changeFlow', 'sender');
        $scope.nav1State = 'active';
        //$scope.isEventMsgShown = false;
        $scope.setType = function (e, type) {
            requestObject.type = type;
            e.preventDefault();

            FacebookFriends().then(function (friends) {
                console.log('[Step1Ctrl] FacebookFriends.then ' + friends.length);
                _goNext(type);
            }, function (error) {
                console.log('[Step1Ctrl] FacebookFriends.rejected: ' + error);
            });
        };
        function _goNext (type) {
            $location.path( type == 'myself' ? '/step3' : '/step2');
        }
    });
