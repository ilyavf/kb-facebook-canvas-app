'use strict';

angular.module('myappApp')
    .controller('Step5Ctrl', function($scope, PrepareRequestData, SaveRequestData, SendRequest) {
        console.log('Step 5');

        var requestData = PrepareRequestData();

        if (!requestData.rsubject || requestData.recipients.length === 0) {
            $scope.isValid = false;
            return;
        }

        $scope.selectedSubject = requestData.rsubject.name;
        $scope.recipients = _.map(requestData.recipients, function (o) { return o.name;}).join(', ');

        $scope.isValid = true;

        SaveRequestData(requestData);

        // send emails:
        SendRequest({
            sender: requestData.currentUserInfo,
            subject: requestData.rsubject,
            //message: requestObject.message,
            type: 'request',
            recipients: requestData.recipients
        })
        .then(function () {
            console.log('[Step5.SendRequest]: promise resolved', arguments);
            $scope.$apply(function () {
                $scope.$emit('wizardInactive');
            });
        });
    });
