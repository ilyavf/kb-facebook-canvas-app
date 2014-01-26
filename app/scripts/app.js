'use strict';

angular.module('myappApp', [
    //'ngCookies',
    //'ngResource',
    //'ngSanitize',
    'ngRoute',
    'angularFileUpload',
    'firebase'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'InitCtrl',
                templateUrl:'views/init.html'
            })
            .when('/step1', {
                controller: 'Step1Ctrl',
                templateUrl:'views/step1.html'
            })
            .when('/step2', {
                controller: 'Step2Ctrl',
                templateUrl:'views/step2.html'
            })
            .when('/step3', {
                controller: 'Step3Ctrl',
                templateUrl:'views/step3.html'
            })
            .when('/step4', {
                controller: 'Step4Ctrl',
                templateUrl:'views/step4.html'
            })
            .when('/step5', {
                controller: 'Step5Ctrl',
                templateUrl:'views/step_final.html'
            })
            .when('/receiver/step1', {
                controller: 'Receiverstep1Ctrl',
                templateUrl:'views/receiver_step1.html'
            });
    });
