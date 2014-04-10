'use strict';

angular.module('myappApp')
    .factory('FacebookFriends', function($q, ExtendFacebookFriends, CurrentUser) {
        console.log('[FacebookFriends] init');
        var deferred;

        return function () {
            if (!deferred) {
                deferred = $q.defer();
                loadFriends().then(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                    deferred = null;
                });
            }
            return deferred.promise;
        };

        function loadFriends () {
            var deferred = $q.defer();

            //FB.api('/me/friends?fields=username,name', function (response) {

            CurrentUser.requirePermission('user_photos,user_relationships')
                .then(function () {
                    console.log('[FacebookFriends] User logged in. Getting user profile...');
                    return CurrentUser.getInfo();
                })
                .then(function () {
                    return fb_load_users();
                })
                .then(function (friends) {
                    deferred.resolve(friends);
                }).catch(function (error) {
                    console.log('[FacebookFriends] catch ' + error, error);
                    deferred.reject(error);
                });

            return deferred.promise;
        };


        // To retrieve info from "family" table we need "user_relationships" permission.
        function fb_load_users () {
            var deferred = $q.defer();

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

                    console.log('[FacebookFriends] looking for user\'s significant other among friends...');
                    CurrentUser.getInfo().then(function (info) {

                        var spouse = info.spouse;
                        if (spouse) {
                            //var friend = _.where(friends, {id: parseInt(spouse.id)})[0];
                            var friend = friends.reduce(function (prev, cur) {
                                return cur.id == spouse.id ? cur : prev;
                            }, false);

                            if (friend) {
                                console.log('[FacebookFriends] found user\'s spouse ' + friend.name);
                                friend.relationship = 'spouse';
                            }
                        }
                        console.log('All friends: ' + friends.length);
                        deferred.resolve(friends);
                    });
                }
            });

            return deferred.promise;
        }
    });
