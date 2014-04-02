'use strict';

angular.module('myappApp')
    .factory('CloneFriends', function ($rootScope, FacebookFriends) {
        console.log('[CloneFriends] init');
        return function (name, initValue, source) {
            console.log('[CloneFriends] exec for ' + name);
            var friendsCloned = [],
                //dataService = source === 'RELEVANT_FRIENDS' ? FacebookTagFriends : FacebookFriends;
                dataService = FacebookFriends;
            if (initValue) {
                friendsCloned.push(initValue);
            }
            dataService.then(function(friends) {
                console.log('[CloneFriends] then for ' + name + '(' + source + ')', friends);
                _.each(friends, function (f) {
                    friendsCloned.push(_.clone(f));
                });
            });
            friendsCloned.reset = function () {
                _.each(this, function (f) {
                    f.selected = false;
                    f.notification_sent = false;
                    f.msgSent = false;
                })
            }
            return friendsCloned;
        }
    });
