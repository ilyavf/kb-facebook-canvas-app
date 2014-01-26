'use strict';

angular.module('myappApp')
    .factory('ExtendFacebookFriends', function () {
        return function (fb_friends_data) {
            return fb_friends_data
                .filter(function (f) {
                    return !!f.username;
                })
                .map(function (f) {
                    return {
                        id: f.uid || f.id,
                        name: f.name,
                        username: f.username,
                        selected: false
                    };
                });
        }
    });
