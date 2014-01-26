'use strict';

angular.module('myappApp')
    .factory('FacebookFriends', function($q, ExtendFacebookFriends) {
        console.log('[FacebookFriends] init');
        var deffered = $q.defer();
        FB.api('/me/friends?fields=username,name', function (response) {
            var friends = ExtendFacebookFriends(response.data);
            console.log('All friends: ' + friends.length);
            deffered.resolve(friends);
        });
        return deffered.promise;
    });
