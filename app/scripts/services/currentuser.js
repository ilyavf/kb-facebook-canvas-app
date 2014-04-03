/**
 * CurrentUser.
 * API:
 *      getInfo             {promise}
 *      $getFire            {promise}
 *      requirePermission   {promise}
 *      listPermissions     {promise}
 *
 * Available Facebook permissions: 'user_friends', 'user_photos', 'publish_stream', 'user_relationships'.
 */


'use strict';

angular.module('myappApp')
.factory('CurrentUser', function ($q, $rootScope, GetUser, $firebase) {

    var wrapPromises = {};
    function wrapPromise (promise, async) {
        var promises = wrapPromises;

        console.log('[wrapPromise] ' + !!promises[promise] + ' ' + async.length);
        if (!promises[promise]) {
            console.log('[wrapPromise] creating promise');
            var deferred = $q.defer();
            promises[promise] = deferred.promise;

            // chain multiple promises:
            var promiseChain = async.reduce(function (asyncPromiseChain, asyncFunc) {
                if (asyncPromiseChain) {
                    return asyncPromiseChain.then(function () {
                        return asyncFunc();
                    })
                } else {
                    return asyncFunc();
                }
            }, false);

            promiseChain
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (reason) {
                    deferred.reject(reason);
                    promises[promise] = null;
                });
        }

        return promises[promise];
    }

    var fbAppId = '203880539796100',
        loginStatusDeferred = $q.defer(),

        fbPermissions = [],
        $fire = null,

        api = {
            //@returns {promise}
            login: function () {
                return wrapPromise('loginPromise', [fbLogin]);
            },
            //@returns {promise}
            getInfo: function () {
//                console.log('api->getInfo()');
//                if (!infoPromise) {
//                    var deferred = $q.defer();
//                    infoPromise = deferred.promise;
//
//                    this.login()
//                        .then(function () {
//                            return fbGetProfile();
//                        })
//                        .then(function (profile) {
//                            deferred.resolve(profile);
//                        })
//                        .catch(function (reason) {
//                            deferred.reject(reason);
//                            infoPromise = null;
//                        });
//                }
//                return infoPromise;

                return wrapPromise('infoPromise', [api.login, fbGetProfile]);
            },
            //@returns {promise}
            $getFire: function () {

            },
            //@returns {promise}
            requirePermission: function (perm) {

            },
            //@returns {promise}
            listPermissions: function (optPerm) {

            }
        },
        user = {
            api: api,

            // depricated...
            initialized: false,
            profileLoaded: false,
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

    window.CurrentUser = api;


    return user;


    function fbLogin() {
        var deferred = $q.defer();
        FB.login( function (response) {
            if (response.authResponse) {
                deferred.resolve(response.authResponse);
            } else {
                var msg = 'User cancelled login or did not fully authorize.';
                console.log('[fbLogin]: ' + msg);
                deferred.reject(msg);
            }
        });
        return deferred.promise;
    }
    function fbGetProfile() {
        var deferred = $q.defer();
        FB.api('/me?fields=name,username,relationship_status,significant_other', function (response) {
            console.log('[fb_getMyInfo]: FB.api/me - Current user: ' + (response.name || response.error.message) + '.', response);
            if (response.error) {
                deferred.reject(response.error.message);
            } else {
                var userProfile = {};
                userProfile.id = response.id;
                userProfile.name = response.name || '';
                userProfile.username = response.username || '';
                userProfile.relationship_status = response.relationship_status || '';
                userProfile.spouse = response.significant_other || '';
                deferred.resolve(userProfile);
            }
        });
        return deferred.promise;
    }
    function fb_login(user, perm) {
        var deferred = $q.defer();

        var callback = function(response) {
            if (response.authResponse) {

                if (!perm) {
                    // ilya: user.loginStatus is a promise that gets resolved by fb_getMyInfo().
                    deferred.resolve(fb_getMyInfo(user));
                } else {
                    user.loginStatus.then(function () {});

                    deferred.resolve(checkPerm(perm));
                }

            } else {
                var msg = 'User cancelled login or did not fully authorize.';
                deferred.reject(msg);
                console.log(msg);
            }
        };

        // When we request permissions then we have make another call to read them from FB:
        // @return {promise}
        var checkPerm = function (perm) {
            var permissionReadDeferred = $q.defer();

            // This call will return all granted permissions:
            FB.api('/' + user.info.id + '/permissions', function(response){
                console.log('Prms:', arguments);
                var permissions = response && response.data && response.data[0],
                    requestedPerms = perm.split(',');
                if (permissions && _.all(requestedPerms, function (v) { return permissions[v];})) {
                    console.log('[CurrentUser] required permissions granted: ' + perm, permissions);
                    permissionReadDeferred.resolve(permissions);
                } else {
                    console.log('[CurrentUser] permissions cancelled: ' + perm, permissions);
                    permissionReadDeferred.reject({
                        msg: 'User did not grant requested permissions',
                        requestedPerm: perm,
                        receivedPerm: permissions
                    });
                }
            });
            return permissionReadDeferred.promise;
        };

        if (perm) {
            FB.login( callback, {scope: perm} );
        } else {
            FB.login( callback );
        }

        return deferred.promise;
    }

    /**
     *
     * @param user
     * @returns {promise}
     */
    function fb_getMyInfo (user) {
        if (user.profileLoaded) {
            return user.loginStatus;
        }
        FB.api('/me?fields=name,username,relationship_status,significant_other', function (response) {
            console.log('[fb_getMyInfo]: FB.api/me - Current user: ' + response.name + '.', response);
            user.profileLoaded = true;

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
        return user.loginStatus;
    }


});
