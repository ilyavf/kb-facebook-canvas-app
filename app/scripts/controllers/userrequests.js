'use strict';

angular.module('myappApp')
    .controller('UserrequestsCtrl', function($scope, CurrentUser, SendReminder) {
        console.log('UserrequestsCtrl');
        $scope.currentRequestIndex = 0;
        $scope.userdata = CurrentUser.$fire;
        $scope.show = false;

        $scope.$on('wizardIsActive', function () {
            console.log('[UserrequestsCtrl] wizardIsActive');
            $scope.isVisible = false;
        });
        $scope.$on('wizardIsInactive', function () {
            console.log('[UserrequestsCtrl] wizardIsInactive');
            $scope.isVisible = true;
        });
        $scope.showNextRequest = function () {
            $scope.currentRequestIndex++;
        };
        $scope.countItems = function (obj) {
            return !!obj && _.keys(obj).length;
        };
        $scope.sendReminder = function (user, object) {
            console.log('[sendReminder]', user, object);
            user.isLoading = 'loading';
            SendReminder(user, object).then(function () {
                user.isReminderSent = true;
                user.date = new Date().toJSON();
                CurrentUser.$fire.$save()
                user.isLoading = '';
            });
        };
        $scope.isReminderVisible = function (user) {
            return user.status === 'pending'
                && user.isReminderSent !== true
                && (!user.date || new Date(user.date).toDateString() != new Date().toDateString());
        }
    });
