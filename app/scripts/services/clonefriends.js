'use strict';

angular.module('myappApp')
    .factory('CloneFriends', function ($q,  FacebookFriends, CurrentUser) {
        console.log('[CloneFriends] init');

        return function (name, initValue, reinit) {
            var deferred = $q.defer(),
                friendsCloned = [];

            console.log('[CloneFriends] exec for ' + name);
                //dataService = source === 'RELEVANT_FRIENDS' ? FacebookTagFriends : FacebookFriends;
            if (initValue && initValue == 'myself') {
                CurrentUser.loginStatus.then(function () {
                    friendsCloned.push(_.clone(CurrentUser.info));
                });
            }
            FacebookFriends(reinit).then(function(friends) {
                console.log('[CloneFriends] then for ' + name, friends);
                _.each(friends, function (f) {
                    friendsCloned.push(_.clone(f));
                });
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
