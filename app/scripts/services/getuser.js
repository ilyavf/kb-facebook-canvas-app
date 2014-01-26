'use strict';

angular.module('myappApp')
    .factory('GetUser', function(fireUsersUrl) {
        return function (id) {
            console.log('[Firebase.GetUser] ' + fireUsersUrl + '/' + id);
            return new Firebase(fireUsersUrl + '/' + id);
        }
    });
