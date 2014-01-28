'use strict';

angular.module('myappApp')
    .directive('kbDialogPhotofinder', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/dialog_photofinder.html',
            //transclude: true,
            scope: {
                'close': '&onClose',
                'action': '&onAction',
                'notifyEmail': '=notifyEmail'
            },
            link: function (scope) {
                scope.notifyIsVisible = true;
                scope.thankyouIsVisible = false;
                scope.notify = function () {
                    scope.action();
                    scope.notifyIsVisible = false;
                    scope.thankyouIsVisible = true;
                }
            }
        };
    });
