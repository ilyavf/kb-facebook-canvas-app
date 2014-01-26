'use strict';

angular.module('myappApp')
    .factory('FacebookTagFriends', function($q, ExtendFacebookFriends) {
        console.log('[FacebookTagFriends] init');
        var deffered = $q.defer();
        FB.api('/fql', {
            q:  'SELECT name, username, uid FROM user WHERE uid IN (' +
                'SELECT uid1 FROM friend WHERE uid2=me() and uid1 IN (' +
                'SELECT owner FROM photo WHERE object_id IN (' +
                'SELECT object_id FROM photo_tag WHERE subject = me()' +
                ')' +
                ')' +
                ')'
        }, function (response) {
            var friends = ExtendFacebookFriends(response.data);
            console.log('Relevant friends: ' + friends.length);
            deffered.resolve(friends);
        });
        return deffered.promise;
    });
