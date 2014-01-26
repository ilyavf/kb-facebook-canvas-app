'use strict';

angular.module('myappApp')
.factory('CurrentUser', function ($rootScope, GetUser, $firebase) {

    var userId = CONFIG.USER_ID,
        user = {
            loginStatus: false,
            info: {
                id: userId,
                name: null,
                username: null
            },
            $fire: $firebase(GetUser(userId))
            //data: GetUser(userId)
        };

    FB.init({
        appId: CONFIG.APP_ID
    });
    FB.getLoginStatus(function(response) {
        console.log(response);
        if (response && response.status === "connected") {
            console.log('Already connected with FB');
            $rootScope.$apply(function () {
                user.loginStatus = true;
            });
            fb_getMyInfo(user.info, user.$fire);
        } else {
            fb_login(user.info);
        }
    });

    console.log('[factory.CurrentUser]: ' + angular.toJson(user));
    window.CurrentUser = user;
    return user;

    function fb_login(user) {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                user.loginStatus = true;

            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'user_friends,user_photos,publish_stream'});
    }
    function fb_getMyInfo (info, fb_data) {
        FB.api('/me?fields=name,username', function (response) {
            console.log('[FB.api:/me] Current user: ' + response.name + '.', response);
            info.id = response.id;
            info.name = response.name;
            info.username = response.username;
            fb_data.$child('info').$set(info);
        });
    }
});
