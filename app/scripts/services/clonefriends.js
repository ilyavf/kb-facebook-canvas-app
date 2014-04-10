'use strict';

angular.module('myappApp')
    .factory('CloneFriends', function ($q,  FacebookFriends, CurrentUser) {
        console.log('[CloneFriends] init');

        return function (name, initValue) {
            var deferred = $q.defer(),
                friendsCloned = [];

            console.log('[CloneFriends] exec for ' + name);
            CurrentUser.getInfo().then(function (userProfile) {
                if (initValue && initValue == 'myself') {
                    console.log('[CloneFriends] then adding user himself to the list of ' + name);
                    friendsCloned.push(_.clone(userProfile));
                }
                return FacebookFriends();
            })
            .then(function(friends) {
                _.each(friends, function (f) {
                    friendsCloned.push(_.clone(f));
                });

                console.log('[CloneFriends] then for ' + name + ', friendsCloned length ' + friendsCloned.length);
                deferred.resolve(friendsCloned);
            });
            friendsCloned.reset = function () {
                _.each(this, function (f) {
                    f.selected = false;
                    f.notification_sent = false;
                    f.msgSent = false;
                })
            }

            return deferred.promise;
        }
    });
