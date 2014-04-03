'use strict';

angular.module('myappApp')
    .factory('FriendReceivers', function (CloneFriends) {
        // @return {promise}
        return CloneFriends('FriendReceivers');
    });
