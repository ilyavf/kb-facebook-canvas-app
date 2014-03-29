'use strict';

angular.module('myappApp')
    .factory('ExtendFacebookFriends', function () {
        return function (fb_friends_data) {
            return fb_friends_data
//                .filter(function (f) {
//                    //Ilya: don't check username since we don't send emails anymore.
//                    //return !!f.username;
//                    return true;
//                })
                .map(function (f) {
                    return {
                        id: parseInt(f.uid || f.id),
                        name: f.name,
                        username: f.username,
                        selected: false,
                        relationship: f.relationship || 'friend'
                    };
                });
        }
    });
