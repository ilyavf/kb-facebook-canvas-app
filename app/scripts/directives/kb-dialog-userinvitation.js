'use strict';

angular.module('myappApp')
    .directive('kbDialogUserinvitation', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/dialog_userinvitation.html',
            //transclude: true,
            scope: {
                'close': '&onClose',
                'action': '&onAction'
            },
            link: function (scope) {
            }
        };
    });
