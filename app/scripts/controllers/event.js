'use strict';

angular.module('myappApp')
    .controller('EventCtrl', function ($scope) {
        $scope.$on('wizardActive', function () {
            console.log('[EventController] wizardActive');
            $scope.$broadcast('wizardIsActive');
        });
        $scope.$on('wizardInactive', function () {
            console.log('[EventController] wizardInactive');
            $scope.$broadcast('wizardIsInactive');
        });
        $scope.$on('changeFlow', function (ev, value) {
            console.log('[EventController.changeFlow] ' + value);
            $scope.flow = value;
        });
    });
