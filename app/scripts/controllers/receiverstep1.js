'use strict';

angular.module('myappApp')
    .controller('Receiverstep1Ctrl', function (
        $scope, $routeParams, $location, $upload, $q, $timeout, $rootScope,
        CurrentUser, getAlbumId, GetPhotoUrlPromise, GetUser, SendRequest
    ) {
        console.log('[Receiverstep1Ctrl]:' + $routeParams['requestId']);

        var permissions = 'user_photos,publish_stream',
            userId = $routeParams['userId'] || '1025306488',
            subjectId = $routeParams['requestId'],
            isFirebaseReady = false,
            currentUser,
            $currentUserFireDeferred = $q.defer(),
            pendingRequest,
            albumData,
            correspondingSentRequest;

        $scope.isUploaderVisible = false;
        $scope.uploadedPhotos = [];
        $scope.dialogPhotofinderIsVisible = false;
        $scope.notifyEmail = {value: ''};

        $scope.openUploader = function () {
            if (!isFirebaseReady){
                return;
            }
            $scope.isUploaderVisible = true;
            document.getElementById('file-upload-input').click();
        };
        $scope.saveEmailAddress = function () {
            $currentUserFireDeferred.promise.then(function ($fire) {
                console.log('[Receiverstep1Ctrl.saveEmailAddress] ' + $scope.notifyEmail.value);
                $fire.notifyEmail = $scope.notifyEmail.value;
                $fire.$save();
            });
        };
        $scope.onFileSelect = function($files) {
            $scope.loading = "loading";

            CurrentUser.requirePermission(permissions)
                .then(function (allPermissions) {
                    console.log('[Receiverstep1Ctrl] Permissions are OK: ', allPermissions);
                    return CurrentUser.$getFire();
                })
                .then(function ($fire) {
                    return getUploadUrl($fire, pendingRequest);
                })
                .then(function (data) {
                    var $fire = data[0],
                        uploadUrl = data[1];

                    // redefine handler to skip successful promise chain:
                    $scope.onFileSelect = function($files) {
                        $scope.loading = "loading";
                        FileSelect($files, $fire, uploadUrl);
                    };

                    FileSelect($files, $fire, uploadUrl);
                })
                .catch(function (reason) {
                    console.log('[Receiverstep1Ctrl] permissions rejected: ', reason);
                    $scope.loading = "";
                });
        };

        // When we get here we don't want to ask Facebook immediately
        // instead we get user info from Firebase:
        CurrentUser.getFireByUserId({id:userId}).then(function ($fire) {
            $currentUserFireDeferred.resolve($fire);
            pendingRequest = getPendingRequest($fire);

            if (!pendingRequest) {
                console.log('[Receiverstep1Ctrl] no pending requests found. Redirecting to init step...');
                $location.path('/');
                return;
            } else {
                $scope.$emit('changeFlow', 'receiver');
                $scope.$emit('wizardActive');
                isFirebaseReady = true;
                $scope.senderName = pendingRequest.sender.name;
                $scope.senderImgUrl = '//graph.facebook.com/' + pendingRequest.sender.username + '/picture';
                $scope.subjectName = pendingRequest.subject.name;
            }
        });

        function getPendingRequest($fire) {
            var pending = _.where($fire.received, {status: 'pending'}),
                pendingRequest = subjectId && _.filter($fire.received, function (o) { return o.subject.id == subjectId})[0]
                    || pending[pending.length - 1];

            console.log('- # of pending requests: ' + pending.length);
            if (pendingRequest) console.log('- processing request: ' + pendingRequest.subject.name);

            return pendingRequest;
        }

        // This uses angularFileUpload ng module.
        function FileSelect($files, $fire, uploadUrl) {
            var uploadedFiles = 0;

            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                console.log('- file: ', file);
                (function(i, file){
                    console.log('- starting upload for ' + i);
                    $scope.upload = $upload
                        .upload({
                            url: uploadUrl,
                            withCredential: true,
                            data: {
                                access_token: FB.getAccessToken()
                            },
                            file: file
                        })
                        .progress(function(evt) {
                            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                        })
                        .success(function(data, status, headers, config) {
                            // file is uploaded successfully
                            console.log(data);
                            if (data.id) {
                                GetPhotoUrlPromise(data.id).then(function (url) {
                                    console.log('Uploaded: ' + i + ', ' + file.name);
                                    $scope.uploadedPhotos.push(url);
                                    uploadedFiles++;
                                    if (uploadedFiles === $files.length) {
                                        console.log('ALL files uploaded now' + uploadedFiles);
                                        $scope.loading = "";

                                        //send notification to the requester:
                                        SendRequest({
                                            sender: currentUser,
                                            subject: pendingRequest.subject,
                                            photos: uploadedFiles,
                                            recipients: [pendingRequest.sender],
                                            type: 'response'
                                        }).then(function () {
                                                console.log('[Receiverstep1Ctrl.sentPromise]: ', arguments);
                                            });
                                    }
                                });
                            }

                            // save flag for receiver:
                            //pendingRequest.status = 'completed';
                            // ilya: this causes error "WebSocket is already in CLOSING or CLOSED state."
                            //CurrentUser.$fire.$save();

                            $fire.$child('received').$child(pendingRequest.subject.id).$child('status').$set('completed');

                            // save flag for sender:
                            correspondingSentRequest.child('status').set('completed');
                            correspondingSentRequest.child('albumInfo').set(albumData);
                            correspondingSentRequest.child('date').set(new Date().toJSON());
                            correspondingSentRequest.child('photos').push({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                fbId: data.id
                            });
                        });

                }(i, file));
            }
        };

        function getUploadUrl ($fire, pendingRequest) {
            var deferred = $q.defer();

            $q.all({
                album: getAlbumId(pendingRequest),
                currentUser: CurrentUser.getInfo()
            }).then(function (resolved) {
                currentUser = resolved.currentUser;
                albumData = resolved.album;

                correspondingSentRequest = GetUser(pendingRequest.sender.id)
                    .child('sent')
                    .child(pendingRequest.subject.id)
                    .child('recipients')
                    .child(currentUser.id);

                console.log('albumPromise resolved with:' + albumData.id, albumData);

                var uploadUrl = 'https://graph.facebook.com/' + albumData.id + '/photos';
                console.log('uploadUrl = ' + uploadUrl);

                deferred.resolve([$fire, uploadUrl]);
            });

            return deferred.promise;
        }
    });