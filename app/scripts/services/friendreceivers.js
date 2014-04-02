'use strict';

angular.module('myappApp')
    .factory('FriendReceivers', function (CloneFriends, CurrentUser) {
        //return CloneFriends('FriendReceivers', _.clone(CurrentUser.info));
        return CloneFriends('FriendReceivers');
    });
