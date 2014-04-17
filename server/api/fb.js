var request = require('request'),
    Q = require('q');

const APP_ID = '203880539796100';
const APP_SECRET = '6569db13948e289d85ed5b415c1726f9';
const FB_GRAPH_URL = 'https://graph.facebook.com';
const FB_NOTIFICATIONS_URL = FB_GRAPH_URL + '/{user_id}/notifications';
const FB_APP_TOKEN_URL = FB_GRAPH_URL + '/oauth/access_token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials';
const APP_URL_REQUEST = '?user={user_id}&requestsubject={subject_id}';

var app_token;

var sendNotifications = function (req, res) {
    console.log(timestamp() + 'module fb.sendNotification');

    var sender = req.param('sender'),
        subject = req.param('subject'),
        type = req.param('type') || 'request',  // 'request' | 'response'
        photos = req.param('photos') || 0,
        //customMessage = req.param('message'),
        contacts = req.param('contacts'),
        messageTpl = type === 'request'
            ? '{sender} asked you to share photos of {subject}'
            : '{sender} uploaded {photos_amount} photo{plural} of {subject}'
                .replace('{photos_amount}', photos)
                .replace('{plural}', (photos > 1 ? 's' : '')),
        result = {notification_sent:[], failed:[], subject: subject},
        promises = [];

    if (!sender) return res.json({error: true, message: 'Sender is not specified'});
    if (!subject) return res.json({error: true, message: 'Subject is not specified'});
    if (!contacts) return res.json({error: true, message: 'Contacts are not specified'});

    contacts.forEach(function (user) {
        promises.push(sendSingleRequest(sender, user, subject, messageTpl)
            .then(function () {
                result.notification_sent.push(user);
            }, function (err) {
                result.failed.push({id:user.id, reason: err});
            })
        );
    });

    Q.all(promises).done(function () {
        res.json(result);
    });
};

module.exports = {
    sendNotification: sendNotifications,
    sendSingleNotification: sendSingleNotification,
    testSendRequest: sendSingleRequest
};

function sendSingleRequest (sender, recipient, subject, messageTpl) {

    var deferred = Q.defer(),
        appUrl = APP_URL_REQUEST
            .replace('{user_id}', recipient.id)
            .replace('{subject_id}', subject.id);

    var messageSender = messageTpl
            .replace('{sender}', '@[' + sender.id + ']'),
        message = messageSender
        .replace('{subject}', subject.type == 'friend' ? '@[' + subject.id + ']' : subject.name);

    sendSingleNotification(recipient, appUrl, message)
        .then(function (response) {
            console.log(timestamp() + '[testSendRequest] Notification was sent successfully to: ' + recipient.name);
            deferred.resolve('Sent to ' + recipient.name);
        }, function (error) {
            if (error.search('Cannot send') != -1) {
                console.log(timestamp() + '- rejecting with: Recipient ' + recipient.name + ' is not an app user');
                deferred.reject('Recipient is not an app user');
            } else if (error.search('Cannot tag') != -1) {
                console.log(timestamp() + '- trying to send without tag... to: ' + recipient.name);

                message = messageSender
                    .replace('{subject}', subject.name);

                sendSingleNotification(recipient, appUrl, "Try #2: " + message)
                    .then(function (response) {
                        console.log(timestamp() + '[testSendRequest] Notification was sent successfully from the 2nd TRY to: ' + recipient.name);
                        deferred.resolve('Sent to ' + recipient.name);
                    }, function (err) {
                        console.log(timestamp() + '2nd try failed for: ' + recipient.name + '. ' + JSON.stringify(err));
                        deferred.reject(JSON.stringify(err));
                    });
            } else {
                deferred.reject('Failed for: ' + recipient.name + '. Reason: ' + JSON.stringify(error));
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

    console.log(timestamp() + '[sendSingleNotification] sending to ' + recipient.name + ': ' + message);

    if (!app_token) {
        app_token = getAppToken();
    }

    app_token
        .then(function (token) {
            params.access_token = token;
            return post(url, params);
        })
        .then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        })
        .catch(function (error) {
            deferred.reject(error);
        });


    return deferred.promise;
}
function getAppToken () {
    var deferred = Q.defer();

    var url = FB_APP_TOKEN_URL
        .replace('{client_id}', APP_ID)
        .replace('{client_secret}', APP_SECRET);
    request.get(
        url,
        function (error, response, body) {
            if (!error && response.statusCode == 200 && body.match(/access_token/)) {
                //response format: "access_token=203880539796100|C01i0Zsy2eZ-04UVzaCH3Grobow"
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

    request.post(
        url,
        { form: params },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                deferred.resolve(JSON.parse(body));
            } else {
                deferred.reject(JSON.parse(body).error.message);
            }
        }
    );

    return deferred.promise;
}

function timestamp () {
    return '[' + new Date().toJSON().replace('T',' ').replace(/.{5}$/,'') + '] ';
}