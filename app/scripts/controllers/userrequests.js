'use strict';

angular.module('myappApp')
    .controller('UserrequestsCtrl', function($scope, $location, CurrentUser, SendReminder, FbServices) {
        console.log('[UserrequestsCtrl]');
        window.$location = $location;
        var requestMatch = location.search.match(/user=([\w\s\-\+'",\.;]+)&requestsubject=(\d+)/);

        if (!CurrentUser.initialized && (requestMatch && requestMatch.length == 3 || $location.path() !== '/' && $location.path() !== '')) {
            var requestUser = requestMatch && requestMatch[1],
                requestSubject = requestMatch && requestMatch[2],
                path = requestSubject ? '/receiver/' + requestUser + '/' +  requestSubject : '/step1';

            console.log('[UserrequestsCtrl] not initialized yet. Redirecting to init step...' + $location.path(), requestMatch);

            //$location.path('/init' + path);
            $location.path(path);
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
            SendReminder(user, subject).then(function (response) {
                var data = response && response.data;

                // send FB dialog msg if app notification failed:
                if (!data || !data.notification_sent || data.notification_sent.length === 0) {
                    FbServices.requestMsg(user.id, subject.id).then(function (result) {
                        if (result.status === 'success') {
                            user.isReminderSent = true;
                            user.date = new Date().toJSON();
                            CurrentUser.$getFire().then(function ($fire) {
                                $fire.$save();
                            });
                        }
                        user.isLoading = '';
                    });
                } else {
                    user.isReminderSent = true;
                    user.date = new Date().toJSON();
                    CurrentUser.$getFire().then(function ($fire) {
                        $fire.$save();
                    });
                    user.isLoading = '';
                }
            });
        };
        $scope.isReminderVisible = function (user) {
            return user.status === 'pending'
                && user.isReminderSent !== true
                && (!user.date || new Date(user.date).toDateString() != new Date().toDateString());
        };

        CurrentUser.isLoggedIn().then(function (status) {
            return CurrentUser.$getFire();
        })
        .then(function ($fire) {
            $scope.userdata = $fire;
        });

        console.log('[UserrequestsCtrl] finished');
    });
