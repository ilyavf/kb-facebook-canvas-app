/**
 * CurrentUser
 *
 * API:
 *      isLoggedIn          {promise} Single promise with user login status
 *      login               {promise} Promise chain, successful one Facebook login response
 *      getInfo             {promise} Promise chain, successful one holds user profile
 *      $getFire            {promise} Promise chain, successful one holds link to user's firebase resource
 *      requirePermission   {promise} Promise chain, (one per permission request), successful ones asks Facebook for permissions and hold Facebook response
 *      getFireByUserId     {promise} Promise with a link to user's firebase (is used for saving requests for receivers)
 *
 * Available Facebook permissions: 'user_friends', 'user_photos', 'publish_stream', 'user_relationships'.
 */


'use strict';

angular.module('myappApp')
.factory('CurrentUser', function ($q, $rootScope, $firebase, $window, GetUser) {

    var chainPromises = {},

        fbAppId = '203880539796100',

        isLoggedIn = $q.defer(),

        api = {
            //@returns {promise} All the  methods below:
            isLoggedIn: function () {
                return isLoggedIn.promise;
            },
            login: function () {
                return chainPromise('login', [fbLogin]);
            },
            getInfo: function () {
                return chainPromise('info', [api.login, fbGetProfile]);
            },
            requirePermission: function (perm) {
                return chainPromise((perm || 'listPermissions'), [fbLogin, fbCheckPerm], perm);
            },
            $getFire: function () {
                return chainPromise('userFirebase', [api.getInfo, userFirebase]);
            },
            getFireByUserId: userFirebase
        };

    console.log('FB init...');
    FB.init({
        appId: fbAppId
    });

    // just for debugging:
    $window.currentUser = api;

    return api;


    /***   PRIVATE methods   ***/

    function fbLogin(perm) {
        var deferred = $q.defer();
        FB.login( function (response) {
            if (response.authResponse) {
                deferred.resolve(response.authResponse);
                isLoggedIn.resolve(true);
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
                userProfile.relationship = 'myself';
                userProfile.spouse = response.significant_other || '';
                deferred.resolve(userProfile);

                // every time we retrieve the profile from Facebook we do want to
                console.log('[CurrentUser.fbGetProfile] saving profile to firebase...');
                api.$getFire().then(function ($userFire) {
                    console.log('[CurrentUser.fbGetProfile] recieved firebase link, now saving data...');
                    fireSaveProfile($userFire, userProfile).then(function () {
                        console.log('[CurrentUser.fbGetProfile] profile saved.');
                    }, function (error) {
                        console.log('[CurrentUser.fbGetProfile] could not save profile', error);
                    });
                });
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
            var permissions = response && response.data && response.data[0],
                requestedPerms = perm && perm.split(','),
                requestedPermsOk = requestedPerms && _.all(requestedPerms, function (v) { return permissions[v];});
            if (permissions && (!perm || requestedPermsOk)) {
                console.log('[fbCheckPerm] permissions OK: ' + perm, permissions);
                deferred.resolve(permissions);
            } else {
                console.log('[fbCheckPerm] permissions cancelled: ' + perm, response);
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
            deferred.resolve($userFire);
        });
        return deferred.promise;
    }
    function fireSaveProfile ($userFire, userInfo) {
        var deferred = $q.defer(),
            $userInfo = $userFire.$child('info');

        console.log('[CurrentUser.fireSaveProfile]: saving...', userInfo);
        $userInfo.$update(userInfo, function (error) {
            if (error) {
                console.log('[CurrentUser.fireSaveProfile]: error ' + error, error);
                deferred.reject(error);
            } else {
                console.log('[CurrentUser.fireSaveProfile]: saved user info', userInfo);
                deferred.resolve($userFire);
            }
        });

        return deferred.promise;
    }
    function chainPromise (promiseName, async, asyncArgs) {
        var promises = chainPromises;

        //console.log('[chainPromise] ' + !!promises[promiseName] + ' ' + async.length);
        if (!promises[promiseName]) {
            console.log('[chainPromise] creating promise for ' + promiseName);
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
});
