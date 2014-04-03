'use strict';

angular.module('myappApp')
    .factory('FriendObjects', function (CloneFriends) {
        // @return {promise}
        return CloneFriends('FriendObjects', 'myself');
    });
