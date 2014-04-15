var request = require('request');
var Q = require('q');

const APP_ID = '203880539796100';
const APP_SECRET = '6569db13948e289d85ed5b415c1726f9';
const FB_GRAPH_URL = 'https://graph.facebook.com';
const FB_NOTIFICATIONS_URL = FB_GRAPH_URL + '/{user_id}/notifications';
const FB_APP_TOKEN_URL = FB_GRAPH_URL + '/oauth/access_token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials';
const APP_URL_REQUEST = '?user={user_id}&requestsubject={subject_id}';

var app_token;

var sendNotification = function (req, res) {
    console.log('module fb.sendNotification');
    res.json({test: 'fb.sendNotification.ok'});
};

module.exports = {
    sendNotification: sendNotification,
    sendSingleNotification: sendSingleNotification,
    testSendRequest: testSendRequest
};

function testSendRequest (sender, recipient, subject) {

    var deferred = Q.defer(),
        appUrl = APP_URL_REQUEST
            .replace('{user_id}', recipient.id)
            .replace('{subject_id}', subject.id);

    var messageSender = '@[{sender_id}] asked you to share photos of {subject}'
            .replace('{sender_id}', sender.id),
        message = messageSender
        .replace('{subject}', subject.type == 'friend' ? '@[' + subject.id + ']' : subject.name);

    sendSingleNotification(recipient, appUrl, message)
        .then(function (response) {
            console.log('[testSendRequest] Notification was sent successfully: ' + response);
            deferred.resolve('Sent to ' + recipient.name);
        }, function (error) {
            console.log('[testSendRequest]: sendSingleNotification rejected with: ' + error);

            if (error.search('Cannot send') != -1) {
                console.log('- rejecting with: Recipient is not an app user');
                deferred.reject('Recipient is not an app user');
            } else if (error.search('Cannot tag') != -1) {
                console.log('- trying to send without tag...');

                message = messageSender
                    .replace('{subject}', subject.name);

                sendSingleNotification(recipient, appUrl, "Try #2: " + message)
                    .then(function (response) {
                        console.log('[testSendRequest] Notification was sent successfully from the 2nd TRY: ' + response.success);
                        deferred.resolve('Sent to ' + recipient.name);
                    }, function (err) {
                        console.log('2nd try failed: ' + JSON.stringify(err));
                        deferred.reject(JSON.stringify(err));
                    });
            } else {
                deferred.reject('Failed: ' + JSON.stringify(error));
            }
        });

    return deferred.promise;
}

function sendSingleNotification (recipient, appUrl, message) {
    var deferred = Q.defer(),
        url = FB_NOTIFICATIONS_URL.replace('{user_id}', recipient.id),
        params = {
            access_token: null,
            template: message,
            href: appUrl
        };

    console.log('[sendSingleNotification] sending: ' + message);

    if (!app_token) {
        app_token = getAppToken();
    }

    app_token
        .then(function (token) {
            params.access_token = token;
            console.log('[sendSingleNotification] token resolved with: ' + token);

            return post(url, params);
        })
        .then(function (response) {
            console.log('[sendSingleNotification] post resolved with: ' + response);
            deferred.resolve(response);
        }, function (error) {
            console.log('[sendSingleNotification] post rejected with: ' + error);
            deferred.reject(error);
        });


    return deferred.promise;
}
function getAppToken () {
    var deferred = Q.defer();

    var url = FB_APP_TOKEN_URL
        .replace('{client_id}', APP_ID)
        .replace('{client_secret}', APP_SECRET);
    console.log('get ' + url);
    request.get(
        url,
        function (error, response, body) {
            if (!error && response.statusCode == 200 && body.match(/access_token/)) {
                //access_token=203880539796100|C01i0Zsy2eZ-04UVzaCH3Grobow
                console.log('ok: ' + body);
                var tokenMatch = body.match(/access_token=(.*)/),
                    token = tokenMatch && tokenMatch[1];

                deferred.resolve(token);
            }
            else {
                deferred.reject(body);
            }
        }
    );

    return deferred.promise;
}

function post (url, params) {
    var deferred = Q.defer();

    console.log('post to ' + url + ', ', params);
    request.post(
        url,
        { form: params },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('ok: ' + body);
                deferred.resolve(JSON.parse(body));
            } else {
                console.log('error: ' + body);
                deferred.reject(JSON.parse(body).error.message);
            }
        }
    );

    return deferred.promise;
}