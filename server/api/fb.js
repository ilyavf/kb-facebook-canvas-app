var request = require('request');

const APP_ID = '203880539796100';
const APP_SECRET = '6569db13948e289d85ed5b415c1726f9';
const FB_GRAPH_URL = 'https://graph.facebook.com';
const FB_NOTIFICATIONS_URL = FB_GRAPH_URL + '/{user_id}/notifications';
const FB_APP_TOKEN_URL = FB_GRAPH_URL + '/oauth/access_token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials';
const APP_URL_REQUEST = '?user={user_id}&requestsubject={subject_id}';

var app_token;

var sendNotification = function (req, res) {
    console.log('module fb.sendNotification');
    res.json({test: 'ok3'});
};

module.exports = {
    sendNotification: sendNotification,
    sendSingleNotification: sendSingleNotification,
    testSendRequest: testSendRequest
};

function testSendRequest (sender, recipient, subject) {
    var appUrl = APP_URL_REQUEST
        .replace('{user_id}', recipient.id)
        .replace('{subject_id}', subject.id);

    var messageSender = '@[{sender_id}] asked you to share photos of {subject}'
            .replace('{sender_id}', sender.id),
        message = messageSender
        .replace('{subject}', subject.type == 'friend' ? '@[' + subject.id + ']' : subject.name);

    sendSingleNotification(recipient, appUrl, message, function (error) {
        message = messageSender
            .replace('{subject}', subject.name);

        sendSingleNotification(recipient, appUrl, "Try #2: " + message, function (data) {
            console.log('2nd try failed: ' + JSON.stringify(data));
        });
    });


}

function sendSingleNotification (recipient, appUrl, message, onError) {
    var url = FB_NOTIFICATIONS_URL.replace('{user_id}', recipient.id);

    var params = {
        access_token: null,
        template: message,
        href: appUrl
    };

    getAppToken(function (token) {
        params.access_token = token;
        post(url, params, function (body) {
            if (body.error && body.error.message) {
                console.log('error -> trying again because of: ' + body.error.message);
                onError(body.error.message);
            }
        });
    });
}
function getAppToken (callback) {
    if (app_token) {
        console.log('[getAppToken] app_token is known: ' + app_token);
        return callback(app_token);
    }

    var url = FB_APP_TOKEN_URL
        .replace('{client_id}', APP_ID)
        .replace('{client_secret}', APP_SECRET);
    console.log('get ' + url);
    request.get(
        url,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //access_token=203880539796100|C01i0Zsy2eZ-04UVzaCH3Grobow
                console.log('ok: ' + body);
                var tokenMatch = body.match(/access_token=(.*)/),
                    token = tokenMatch && tokenMatch[1];

                app_token = token;

                callback(token);
            }
            else {
                console.log('error: ' + body);
            }
        }
    );
}

function post (url, params, callback) {
    console.log('post to ' + url + ', ', params);
    request.post(
        url,
        { form: params },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                callback( JSON.parse(body) );
            }
            else {
                console.log('error: ' + body);
                callback( JSON.parse(body) );
            }
        }
    );
}
