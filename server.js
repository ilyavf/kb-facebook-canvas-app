// Run with environment parameter:
// $ NODE_ENV=production node server.js
// $ NODE_ENV=test node server.js
// To specify port directly:
// $ NODE_ENV=production, PORT=1234 node server.js

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
    app_dir = process.env.NODE_ENV === 'production' ? 'dist' : 'app',
    //API_PORT = 1338,
    clientDir = path.join(__dirname, app_dir),
    //api = express(),
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

app.post('/canvas_app/api/send-notification', fb.sendNotification);
app.get('/canvas_app/api/send-notification', fb.sendNotification);
app.post('/api/send-notification', fb.sendNotification);
app.get('/api/send-notification', fb.sendNotification);

app.get('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'index.html'));
});
//app.get('/fb_api/send-notification', fb.sendNotification);
//app.get('/cf/_fb/sendRequest.json', fb.sendNotification);
//app.post('/cf/_fb/sendRequest.json', fb.sendNotification);


// Error handling:
app.use(logErrors);
app.use(clientErrorHandler);

app.listen(APP_PORT);
//api.listen(API_PORT);

console.log(process.env.NODE_ENV.toUpperCase() +  ' Node app webserver listens ' + APP_PORT + '. Client app folder: ' + clientDir);
//console.log('Node api webserver listens ' + API_PORT);



// HTTPS
var options = {
    key: fs.readFileSync('../ssl/kooboodle.key'),
    cert: fs.readFileSync('../ssl/kooboodle.crt')
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("Hello secure world!\n");
}).listen(1338);



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