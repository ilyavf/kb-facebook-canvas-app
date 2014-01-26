'use strict';

angular.module('myappApp')
    .factory('FriendObjects', function (CloneFriends, CurrentUser) {
        return CloneFriends('FriendObjects', _.clone(CurrentUser.info));
    });
