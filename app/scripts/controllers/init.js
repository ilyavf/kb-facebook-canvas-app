/* global _ */
'use strict';

angular.module('myappApp')
    .controller('InitCtrl', function ($scope, $location, CurrentUser) {
        console.log('Init');
        $scope.$watch(
            function() { return CurrentUser.loginStatus; },
            function (newVal, oldVal) {
                console.log('[$watch CurrentUser.loginStatus]: ' + oldVal + ' ' + newVal);
                if (newVal === true) {
                    console.log('- logged in flow. CurrentUser.$fire.info: ' + typeof CurrentUser.$fire.info, CurrentUser, CurrentUser.$fire);

                    if (CurrentUser.$fire && CurrentUser.$fire.info) {
                        console.log('- $fire.info is defined. Continue to the next step');
                        navigate(CurrentUser.$fire);
                    } else {
                        console.log('- $fire.info is NOT defined. Subscribing to firebase data load...');
                        CurrentUser.$fire.$on('loaded', function (data) {
                            console.log('- firebase data gets loaded. Continuing to the next step');
                            navigate(data);
                        });
                    }
                }
            }
        );
        function navigate (data) {
            var pending = data && data.received && _.where(data.received, {status: 'pending'});
            console.log('- [CurrentUser.$fire]: loaded! data, pending::', data, pending);

            if (pending && pending.length > 0) {
                console.log('- receiver flow');
                //require(['kb_ang_step_receiver'], function () {
                //    console.log('... loaded. Go to Receiver Step 1.');
                $location.path('receiver/step1');
                //});
            } else {
                console.log('- regular flow. Loading...');
                //require(['kb_ang_step_controllers'], function () {
                //    console.log('... loaded. Go to Step 1.');
                $location.path('step1');
                //});
            }
        }
    });
