// CONSUMER_KEY=ynsILp4v6EqLOBVldue48Q CONSUMER_SECRET=RauLLXfSB7P5Y7jUCXmwxWOFylSq0IxYhgApMjDa3W0 ACCESS_TOKEN=13604142-dNeWwowlOqBeTeFIOV6kJB5Yyj3lXQxnHofXTkTNM ACCESS_TOKEN_SECRET=RhoiBU2037meC1Ecqsnc4FAOr96l1bgwSFpbvMkTFgo node index.js

var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

io.set('heartbeat timeout', 10);

var query = 'happy';

var stream = T.stream('statuses/filter', {
    track: query
});

stream.on('tweet', function(data) {
    if (data.geo) {
        io.emit('tweeted', data);
    }
});

app.use(express.static(__dirname + '/public'));

http.listen(port, function() {
    console.log('listening on port: ' + port);
});
