//if (!process.env.NODE_ENV) process.env.NODE_ENV='development'

var express = require('express')
    , http = require('http')
    , path = require('path')
    , fb = require('./server/api/fb')
    , bodyParser = require('body-parser')
//    , reload = require('reload')
//    , colors = require('colors')

var app = express();

var clientDir = path.join(__dirname, 'app');

app.set('port', 1337);
app.use(express.static(clientDir));
app.use(bodyParser());

// CORS:
app.all('*', function(req, res, next){
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', 'http://testb.kooboodle.com');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

// Routing:
app.get('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'index.html'));
});
app.get('/fb_api/send-notification', fb.sendNotification);
app.post('/fb_api/send-notification', fb.sendNotification);
app.get('/cf/_fb/sendRequest.json', fb.sendNotification);
app.post('/cf/_fb/sendRequest.json', fb.sendNotification);


// Error handling:
app.use(logErrors);
app.use(clientErrorHandler);

var server = http.createServer(app)

//reload(server, app)

server.listen(app.get('port'), function(){
//    console.log("Web server listening in %s on port %d", colors.red(process.env.NODE_ENV), 1337);
    console.log("Web server listening on port %d", app.get('port'));
});


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