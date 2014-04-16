// Run with environment parameter:
// $ NODE_ENV=production node server.js
// $ NODE_ENV=test node server.js
// To specify port directly:
// $ NODE_ENV=production, PORT=1234, PORT_SSL=1235 node server.js

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV='development';
}

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fb = require('./server/api/fb'),
    bodyParser = require('body-parser'),
    https = require('https'),
    fs = require('fs');

var APP_PORT = process.env.PORT || 1337,
    APP_PORT_SECURE = process.env.PORT_SSL || 1338,
    app_dir = process.env.NODE_ENV === 'production' ? 'dist' : 'app',
    clientDir = path.join(__dirname, app_dir),
    app = express();

app.use(express.static(clientDir));

app.use(bodyParser());

// API CORS:
app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', 'http://testb.kooboodle.com');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

app.post('/api/send-notification', fb.sendNotification);
app.get('/api/send-notification', fb.sendNotification);

app.post('/canvas_app/api/send-notification', fb.sendNotification);
app.get('/canvas_app/api/send-notification', fb.sendNotification);

app.all('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'index.html'));
});

// Error handling:
app.use(logErrors);
app.use(clientErrorHandler);

// HTTPS options:
var credentials = {
    key: fs.readFileSync('../ssl/kooboodle.key'),
    cert: fs.readFileSync('../ssl/kooboodle.crt')
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(APP_PORT);
httpsServer.listen(APP_PORT_SECURE);

console.log(process.env.NODE_ENV.toUpperCase() + '. Client app folder: ' + clientDir);
console.log('HTTP:  on port ' + APP_PORT);
console.log('HTTPS:  on port ' + APP_PORT_SECURE);



function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, { error: 'Something blew up!' });
    } else {
        next(err);
    }
}