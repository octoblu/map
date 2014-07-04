var skynetConfig = {
  "uuid": "c33e14c0-fd55-11e3-a290-ef9910e207d9",
  "token": "0avr9lpll33w0cnmirsghi79omie8kt9",
  "protocol": "websocket",
  "host": "127.0.0.1", // optional (defaults to "http://skynet.im")
  "port": 3000 // optional (defaults to 80)
}
skynet(skynetConfig, function (e, socket, device) {
  if (e) throw e

    console.log('connected to skynet');

  // Subscribe to SkyNet.im messages and events
  socket.emit('subscribe', {
    "uuid": "530ec7a1-02f8-11e4-a1b9-fd8f2922fbb0"
  }, function (data) {
    console.log(data);
  });

  socket.on('message', function(message){
    console.log('message received', message);

    $.ajax({
      url: "/geo/" + message.payload.ipAddress,
      cache: false
    })
      .done(function( data ) {
        console.log('geo', data);
        formatData(data);
      });

    
  });

});


var map = L.mapbox.map('map', 'chrismatthieu.im763216', {
    tileLayer: {
        detectRetina: true
    }
})
    .setView([0, 0], 2);

function formatData(geo) {
    var marker = L.marker([geo[0], geo[1]], {
        icon: L.icon({
            iconUrl: 'http://octoblu-devices.s3.amazonaws.com/skynetpin.png'
        })
    })
        // .bindPopup('<div class="pad1 round clip tile fl">' +
        //         '<img src="' + tweet.user.profile_image_url_https + '" class="round" height="50px" width="50px" />' +
        //         '<p class="small fr col9 white">' +
        //             '<span class="display-block small">' +
        //                 '<span class="white inline">' + tweet.user.name + '</span>' +
        //                 ' <span class="quiet inline"> @' + tweet.user.screen_name + '</span>' +
        //             '</span>' +
        //             tweet.text + '' +
        //             '<a href="https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '" target="_blank"  class="timeago quiet small display-block" title="' + tweet.created_at + '"></a>' +
        //         '</p>' +
        //     '</div>' + '')
        .addTo(map);

    setTimeout(function(){map.removeLayer(marker);}, 1000);             

    // marker.on('popupopen', function() {
    //     $('.timeago').timeago();
    // });

    $('.loading').fadeOut();
}
