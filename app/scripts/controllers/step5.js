'use strict';

angular.module('myappApp')
    .controller('Step5Ctrl', function($scope) {
        console.log('Step 5');

        var requestData = PrepareRequestData();

        if (!requestData.rsubject || requestData.recipients.length === 0) {
            $scope.isValid = false;
            return;
        }

        $scope.selectedSubject = requestData.rsubject.name;
        $scope.recipients = _.map(requestData.recipients, function (o) { return o.name;}).join(', ');

        $scope.isValid = true;

        $scope.$apply(function () {
            $scope.$emit('wizardInactive');
        });
    });
