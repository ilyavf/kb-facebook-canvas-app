'use strict';

angular.module('myappApp')
    .factory('FacebookFriends', function($q, ExtendFacebookFriends, CurrentUser) {
        console.log('[FacebookFriends] init');
        var deffered = $q.defer();
        //FB.api('/me/friends?fields=username,name', function (response) {

        // To retrieve info from "family" table we need "user_relationships" permission.
        // TODO: Run fb_login with {scope:'user_relationships'} here before the fql.
        FB.api('/fql', {
            q:  {
                all_friends:
                    'SELECT name, username, uid FROM user WHERE uid IN (' +
                        'SELECT uid1 FROM friend WHERE uid2=me()' +
                    ')',
                family_members:
                    'SELECT uid, relationship FROM family WHERE profile_id = me()',
                tagged_me:
                    'SELECT name, username, uid FROM user WHERE uid IN (' +
                        'SELECT uid1 FROM friend WHERE uid2=me() and uid1 IN (' +
                            'SELECT owner FROM photo WHERE object_id IN (' +
                                'SELECT object_id FROM photo_tag WHERE subject = me()' +
                            ')' +
                        ')' +
                    ')'
            }
        }, function (response) {
            if (response.error) {
                console.log('*** ERROR *** Cannot retrieve Facebook friends. FB ERROR: ' + response.error.message);
            } else {
                var allFriendsRaw = _.where(response.data, {name: "all_friends"})[0].fql_result_set,
                    familyRaw = _.where(response.data, {name: "family_members"})[0].fql_result_set,
                    taggedMeRaw = _.where(response.data, {name: "tagged_me"})[0].fql_result_set,
                    spouse = CurrentUser.info.spouse,
                    friends = ExtendFacebookFriends(allFriendsRaw);

                _.each(friends, function(f) {
                    // Facebook's table "family" stores uid as strings, table "user" has uid as int

                    var relationship = _.reduce(familyRaw, function (memo, cur) { return cur.uid == f.id ? cur.relationship : memo}, false),
                        taggedMe = _.reduce(taggedMeRaw, function (memo, cur) { return memo || cur.uid == f.id}, false);

                    if (relationship) {
                        f.relationship = relationship;
                    }
                    if (taggedMe) {
                        f.taggedMe = true;
                    }
                });
                if (spouse) {
                    var friend = _.where(friends, {id: parseInt(spouse.id)})[0];
                    if (friend) friend.relationship = 'spouse';
                }
                console.log('All friends: ' + friends.length);
                deffered.resolve(friends);
            }
        });
        return deffered.promise;
    });
