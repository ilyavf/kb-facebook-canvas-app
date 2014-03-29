'use strict';

angular.module('myappApp')
.factory('CurrentUser', function ($q, $rootScope, GetUser, $firebase) {

    var fbAppId = '203880539796100',
        loginStatusDeferred = $q.defer(),
        user = {
            initialized: false,
            loginStatus: loginStatusDeferred.promise,
            info: {
                id: null,
                name: null,
                username: null,
                relationship: 'myself'
            },
            $fire: null
            //$fire: $firebase(GetUser(userId))
            //data: GetUser(userId)
        };

    console.log('FB init...');
    FB.init({
        appId: fbAppId
    });
    console.log('FB getLoginStatus...');
    FB.getLoginStatus(function(response) {
        console.log(response);
        if (response && response.status === "connected") {
            console.log('Already connected with FB');
            fb_getMyInfo(user);
        } else {
            console.log('Not logged in. Logging in to Facebook...');
            fb_login(user);
        }
    });

    console.log('[factory.CurrentUser]: ' + angular.toJson(user));
    window.CurrentUser = user;
    return user;

    function fb_login(user) {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                fb_getMyInfo(user);

            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'user_friends,user_photos,publish_stream,user_relationships'});
    }
    function fb_getMyInfo (user) {
        FB.api('/me?fields=name,username,relationship_status,significant_other', function (response) {
            console.log('[fb_getMyInfo]: FB.api/me - Current user: ' + response.name + '.', response);
            user.info.id = response.id;
            user.info.name = response.name || '';
            user.info.username = response.username || '';
            user.info.relationship_status = response.relationship_status || '';
            user.info.spouse = response.significant_other || '';
            user.$fire = $firebase(GetUser(user.info.id));
            user.$fire.$on('loaded', function (data) {
                console.log('[fb_getMyInfo] firebase user data loaded: ', data);
                user.$fire.$child('info').$set(user.info);

                $rootScope.$apply(function () {
                    console.log('- resolving loginStatusDeferred to TRUE...');
                    loginStatusDeferred.resolve(true);
                });
            });
        });
    }
});
