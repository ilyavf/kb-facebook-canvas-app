var fb = require('./fb.js');

// (userId, message, appUrl) => json
fb.testSendRequest(
    {id: '100004353247811'},
    {id: '100006414373418'},
    {id: '100004353247811', type: 'friend'},
    'Hey, gimme some photos of myself!'
);