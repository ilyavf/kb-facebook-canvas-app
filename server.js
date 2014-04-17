/**
 * Run with environment parameter:
 * $ NODE_ENV=production node server.js
 * $ NODE_ENV=test node server.js
 *
 * To specify port directly:
 * $ NODE_ENV=production, PORT=1234, PORT_SSL=1235 node server.js
 *
 * To disable ssl:
 * $ PORT_SSL=0 node server.js
 *
 */



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
    SSL = process.env.SSL == 'false' ? false : true,
    app_dir = process.env.NODE_ENV === 'production' ? 'dist' : 'app',
    clientDir = path.join(__dirname, app_dir),
    ssl_dir = path.join(__dirname, '../ssl'),
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

var httpServer = http.createServer(app);
httpServer.listen(APP_PORT);

console.log(timestamp() + process.env.NODE_ENV.toUpperCase() + '. Client app folder: ' + clientDir);
console.log(timestamp() + 'HTTP:  on port ' + APP_PORT);

if (SSL) {
    // HTTPS options:
    var credentials = {
        key: fs.readFileSync(ssl_dir + '/kooboodle.key'),
        cert: fs.readFileSync(ssl_dir + '/kooboodle.crt')
    };

    https
        .createServer(credentials, app)
        .listen(APP_PORT_SECURE);

    console.log(timestamp() + 'HTTPS:  on port ' + APP_PORT_SECURE);
} else {
    console.log(timestamp() + 'NO SSL');
}


function timestamp () {
    return '[' + new Date().toJSON().replace('T',' ').replace(/.{5}$/,'') + '] ';
}
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
