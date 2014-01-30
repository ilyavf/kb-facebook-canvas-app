'use strict';

angular.module('myappApp')
    .controller('Receiverstep1Ctrl', function ($scope, CurrentUser, $location, $upload, getAlbumId, GetPhotoUrlPromise, GetUser, SendRequest) {
        $scope.$emit('changeFlow', 'receiver');
        console.log('Receiver Step 1');
        $scope.isUploaderVisible = false;
        $scope.$emit('wizardActive');
        $scope.openUploader = function () {
            console.log('[openUploader clicked]');
            $scope.isUploaderVisible = true;
            document.getElementById('file-upload-input').click();
        };
        $scope.uploadedPhotos = [];

        $scope.isEventMsgShown = false;
        $scope.showEventMsg = function () {
            $scope.isEventMsgShown = !$scope.isEventMsgShown;
        };

        var pending = _.where(CurrentUser.$fire.received, {status: 'pending'}),
            pendingRequest = pending[0];

        if (!pendingRequest) {
            console.log('[Receiverstep1Ctrl] no pending requests found. Redirecting to init step...');
            $location.path('/');
            return;
        }

        $scope.senderName = pendingRequest.sender.name;
        $scope.senderImgUrl = '//graph.facebook.com/' + pendingRequest.sender.username + '/picture';
        $scope.subjectName = pendingRequest.subject.name;


        $scope.dialogPhotofinderIsHidden = true;
        $scope.hideDialogPhotofinder = function () {
            $scope.dialogPhotofinderIsHidden = true;
        };
        $scope.showDialogPhotofinder = function () {
            $scope.dialogPhotofinderIsHidden = false;
        };
        $scope.notifyEmail = {value: ''};
        $scope.saveEmailAddress = function () {
            console.log('[Receiverstep1Ctrl.saveEmailAddress] ' + $scope.notifyEmail.value);
            CurrentUser.$fire.notifyEmail = $scope.notifyEmail.value;
            CurrentUser.$fire.$save();
        }

        //angular.forEach(pending, function (request) {});
        if (pending.length === 0) {
            console.log('WARNING: no pending requests found in ReceiverStep1');
            $location.path('/');
            return;
        }

        var albumPromise = getAlbumId(pendingRequest),
            correspondingSentRequest = GetUser(pendingRequest.sender.id).child('sent').child(pendingRequest.subject.id).child('recipients').child(CurrentUser.info.id);

        albumPromise.then(function (albumData) {
            console.log('albumPromise resolved with:' + albumData.id, albumData);

            var uploadUrl = 'https://graph.facebook.com/' + albumData.id + '/photos';
            console.log('uploadUrl = ' + uploadUrl);


            $scope.onFileSelect = function($files) {
                $scope.loading = "loading";

                var uploadedFiles = 0;

                //$files: an array of files selected, each file has name, size, and type.
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    console.log('- file: ', file);
                    (function(i, file){
                        console.log('- starting upload for ' + i);
                        $scope.upload = $upload.upload({
                            url: uploadUrl, //upload.php script, node.js route, or servlet url
                            // method: POST or PUT,
                            // headers: {'headerKey': 'headerValue'},
                            withCredential: true,
                            data: {
                                //myObj: $scope.myModelObj
                                access_token: FB.getAccessToken()
                            },
                            file: file
                            // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                            /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                            //fileFormDataName: myFile,
                            /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                            //formDataAppender: function(formData, key, val){}
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
                                                sender: CurrentUser.info,
                                                subject: pendingRequest.subject,
                                                emailSubject: CurrentUser.info.name + " has just uploaded " + uploadedFiles + " photos of " + pendingRequest.subject.name,
                                                recipients: [pendingRequest.sender]
                                            }).then(function () {
                                                console.log('[Receiverstep1Ctrl.sentPromise]: ', arguments);
                                            });
                                        }
                                    });
                                }

                                // save flag for receiver:
                                pendingRequest.status = 'completed';
                                pendingRequest.status = 'completed';
                                CurrentUser.$fire.$save();

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
                        //.error(...)
                        //.then(success, error, progress);

                    }(i, file));
                }
            };

        });
    });
