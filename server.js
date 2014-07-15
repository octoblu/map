var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var geoip = require('geoip-lite');

app.use(express.static(__dirname + '/public'));

http.listen(port, function() {
    console.log('listening on port: ' + port);
});
