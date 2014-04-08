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
    function wrapPromise (promiseName, async, asyncArgs) {
        var promises = wrapPromises;

        console.log('[wrapPromise] ' + !!promises[promiseName] + ' ' + async.length);
        if (!promises[promiseName]) {
            console.log('[wrapPromise] creating promise');
            var deferred = $q.defer();
            promises[promiseName] = deferred.promise;

            // chain multiple promises:
            var promiseChain = async.reduce(function (asyncPromiseChain, asyncFunc) {
                if (asyncPromiseChain) {
                    return asyncPromiseChain.then(function (v) {
                        return asyncFunc(asyncArgs || v);
                    })
                } else {
                    return asyncFunc(asyncArgs);
                }
            }, false);

            promiseChain
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (reason) {
                    deferred.reject(reason);
                    promises[promiseName] = null;
                });
        }

        return promises[promiseName];
    }

    var fbAppId = '203880539796100',
        loginStatusDeferred = $q.defer(),

        api = {
            //@returns {promise} All the  methods below:
            login: function () {
                return wrapPromise('login', [fbLogin]);
            },
            getInfo: function () {
                return wrapPromise('info', [api.login, fbGetProfile]);
            },
            requirePermission: function (perm) {
                return wrapPromise((perm || 'listPermissions'), [fbLogin, fbCheckPerm], perm);
            },
            $getFire: function () {
                return wrapPromise('userFirebase', [api.login, userFirebase]);
            },
            $saveProfile: function () {
                return $q.all({
                    info: api.getInfo(),
                    $fire: api.$getFire()
                }).then(function (user) {
                    user.$fire.$child('info').$set(user.info);
                });
            },
            getFireByUserId: userFirebase
        },
        // depricated...
        user = {
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


    return _.extend(user, api);


    function fbLogin(perm) {
        var deferred = $q.defer();
        FB.login( function (response) {
            if (response.authResponse) {
                deferred.resolve(response.authResponse);
            } else {
                var msg = 'User cancelled login or did not fully authorize.';
                console.log('[fbLogin]: ' + msg);
                deferred.reject(msg);
            }
        }, {scope: perm});

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
    // When we request permissions then we have make another call to read them from FB:
    // @return {promise}
    function fbCheckPerm (perm) {
        var deferred = $q.defer();

        // This call will return all granted permissions:
        FB.api('/me/permissions', function(response){
            console.log('[fbCheckPerm]:', response);
            var permissions = response && response.data && response.data[0],
                requestedPerms = perm && perm.split(','),
                requestedPermsOk = requestedPerms && _.all(requestedPerms, function (v) { return permissions[v];});
            if (permissions && (!perm || requestedPermsOk)) {
                console.log('[fbCheckPerm] permissions OK: ' + perm, permissions);
                deferred.resolve(permissions);
            } else {
                console.log('[fbCheckPerm] permissions cancelled: ' + perm, permissions);
                deferred.reject({
                    msg: perm ? 'User did not grant requested permissions' : 'Error',
                    requestedPerm: perm,
                    receivedPerm: permissions,
                    response: response
                });
            }
        });
        return deferred.promise;
    };
    function userFirebase (user) {
        var deferred = $q.defer(),
            $userFire = $firebase(GetUser(user.id || user.userID));

        $userFire.$on('loaded', function (data) {
            console.log('[userFirebase] firebase user data loaded: ', data);
            //$userFire.$child('info').$set(user.info);
            deferred.resolve($userFire);
        });
        return deferred.promise;
    }
    function fireSaveProfile ($userFire) {
        var deferred = $q.defer()

        $userFire.$child('info').$set(user.info);
            deferred.resolve($userFire);
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

                    deferred.resolve(fbCheckPerm(perm));
                }

            } else {
                var msg = 'User cancelled login or did not fully authorize.';
                deferred.reject(msg);
                console.log(msg);
            }
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
