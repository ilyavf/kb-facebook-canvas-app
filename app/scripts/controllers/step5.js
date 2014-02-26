'use strict';

angular.module('myappApp')
    .controller('Step5Ctrl', function($scope, requestObject, $timeout) {
        console.log('Step 5');

        $scope.selectedSubject = requestObject.subject.name;
        $scope.recipients = _.map(requestObject.recipients, function (o) { return o.name;}).join(', ').replace(/\,([^\,]*)$/, ' and $1');

        $scope.isValid = true;

        $timeout(function () {
            $scope.$emit('wizardInactive');
        }, 3000);
    });
