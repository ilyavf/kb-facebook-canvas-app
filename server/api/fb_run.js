var fb = require('./fb.js');

// (userId, message, appUrl) => json
fb.testSendRequest(
    {id: '1025306488', name: 'Nadya'},
    {id: '100004353247811', name: 'Ilya'},
    {id: '100006414373418', name: 'Serezha', type: 'friend'},
    //{id: '100004353247811', name: 'Ilya', type: 'friend'},
    'Hey, gimme some photos of myself!'
).then(function (msg) {
    console.log('Success: ' + msg);
}, function (err) {
    console.log('Failed: ' + err);
});