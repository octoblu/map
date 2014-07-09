var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var geoip = require('geoip-lite');

app.use(express.static(__dirname + '/public'));

app.get('/geo/:ip', function(req, res) {
  var ip = req.params.ip;
  // ip = '174.26.219.34';
  console.log('IP', ip);
  if(ip != undefined){
    var geo = geoip.lookup(ip);
    if(geo){
      res.json(geo.ll);
    }
  }
});

http.listen(port, function() {
    console.log('listening on port: ' + port);
});
