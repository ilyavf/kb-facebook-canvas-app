'use strict';

angular.module('myappApp')
    .controller('Step1Ctrl', function ($scope, requestObject, CurrentUser, FacebookFriends) {
        console.log('Step 1');
        requestObject.reset();
        $scope.$emit('wizardInactive');
        $scope.$emit('changeFlow', 'sender');
        $scope.nav1State = 'active';
        $scope.isEventMsgShown = false;
        $scope.setType = function (e, type) {
            requestObject.type = type;
            e.preventDefault();

            FacebookFriends().then(function () {
                console.log('[Step2Ctrl] FacebookFriends.then ', arguments);
                _goNext(type);
            }, function () {
                // in case user cancels FB login, we go to the 1st screen and reset our promises.
                console.log('[Step2Ctrl] FacebookFriends.rejected (maybe not initialized yet)', arguments);
                FacebookFriends(true).then(function () {
                    _goNext(type);
                });
            });
        };
        function _goNext (type) {
            $location.path( type == 'myself' ? '/step3' : '/step2');
        }
    });
