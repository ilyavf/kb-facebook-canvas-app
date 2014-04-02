'use strict';

angular.module('myappApp')
    .factory('FriendReceiversRelevant', function (CloneFriends, CurrentUser) {
        return CloneFriends('FriendReceiversRelevant', null, 'RELEVANT_FRIENDS');
    });
