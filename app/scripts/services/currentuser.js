'use strict';

angular.module('myappApp')
.factory('CurrentUser', function ($q, $rootScope, GetUser, $firebase) {

    var fbAppId = '203880539796100',
        loginStatusDeferred = $q.defer(),
        user = {
            initialized: false,
            loggedIn: false,
            loginStatus: loginStatusDeferred.promise,
            info: {
                id: null,
                name: null,
                username: null,
                relationship: 'myself',
                existingUser: true
            },
            $fire: null,
            login: function (perm) {
                console.log('Logging in to Facebook... ' + (perm ? ' asking for ' + perm : '' ));
                return fb_login(user, perm);
            }
            //$fire: $firebase(GetUser(userId))
            //data: GetUser(userId)
        };

    console.log('FB init...');
    FB.init({
        appId: fbAppId
    });

    console.log('[factory.CurrentUser]: ' + angular.toJson(user));
    window.CurrentUser = user;
    return user;

    function fb_login(user, perm) {
        var deferred = $q.defer();

        var callback = function(response) {
            if (response.authResponse) {
                // ilya: user.loginStatus is a promise that gets resolved by fb_getMyInfo().
                deferred.resolve(user.loginStatus);

                console.log('[CurrentUser]: Logged in successfully ');
                if (!user.loggedIn) {
                    console.log('- fetching user information...');
                    fb_getMyInfo(user);
                }

            } else {
                var msg = 'User cancelled login or did not fully authorize.';
                deferred.reject(msg);
                console.log(msg);
            }
        };

        //if (!user.loggedIn) {
        //    fb_initial_login ()
        //}

        if (perm) {
            FB.login( callback, {scope: perm} );
            //{scope: 'user_friends,user_photos,publish_stream,user_relationships'}
        } else {
            FB.login( callback );
        }

        return deferred.promise;
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

//    function fb_initial_login () {
//        console.log('FB getLoginStatus...');
//        FB.getLoginStatus(function(response) {
//            console.log(response);
//            if (response && response.status === "connected") {
//                console.log('Already connected with FB');
//                fb_getMyInfo(user);
//            } else {
//                console.log('Not logged in. Logging in to Facebook...');
//                if (perm) {
//                    FB.login( callback, {scope: perm} );
//                    //{scope: 'user_friends,user_photos,publish_stream,user_relationships'}
//                } else {
//                    FB.login( callback );
//                }
//            }
//        });
//    }


});
