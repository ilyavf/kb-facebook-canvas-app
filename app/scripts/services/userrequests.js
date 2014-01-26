'use strict';

angular.module('myappApp')
    .factory('UserRequests', function(CurrentUser) {
        return CurrentUser.$fire.$child('sent');
    });
