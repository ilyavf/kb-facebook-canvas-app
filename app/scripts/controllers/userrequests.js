'use strict';

angular.module('myappApp')
    .controller('UserrequestsCtrl', function($scope, $location, CurrentUser, SendReminder) {
        console.log('[UserrequestsCtrl]');
        window.$location = $location;
        var requestMatch = location.search.match(/requestsubject=([\w\s\-\+'",\.;]*)/);

        if (!CurrentUser.initialized && (requestMatch || $location.path() !== '/' && $location.path() !== '')) {
            console.log('[UserrequestsCtrl] not initialized yet. Redirecting to init step...' + $location.path());
            var requestSubject = requestMatch && requestMatch[1],
                path = requestSubject ? '/receiver/' +  requestSubject : $location.path();

            $location.path('/init' + path);
        }

        $scope.currentRequestIndex = 0;
        $scope.userdata = []; //CurrentUser.$fire;
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
        $scope.sendReminder = function (user, subject) {
            console.log('[sendReminder]', user, subject);
            user.isLoading = 'loading';
            SendReminder(user, subject).then(function () {
                user.isReminderSent = true;
                user.date = new Date().toJSON();
                CurrentUser.$fire.$save();
                user.isLoading = '';
            });
        };
        $scope.isReminderVisible = function (user) {
            return user.status === 'pending'
                && user.isReminderSent !== true
                && (!user.date || new Date(user.date).toDateString() != new Date().toDateString());
        };

        CurrentUser.loginStatus.then(function () {
            $scope.userdata = CurrentUser.$fire;
        });

        console.log('[UserrequestsCtrl] finished');
    });
