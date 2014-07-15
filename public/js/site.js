var path = 'ws://54.191.102.104';
var ws = new WebSocket(path);

ws.onmessage = function(evt){
  try{
    var data = JSON.parse(evt.data);
    console.log('evt', data);

    if(data.geo){
      formatData(data);
    }
  }
  catch(ex){
    console.log('erro on data', ex);
  }
};

var map = L.mapbox.map('map', 'chrismatthieu.im763216', {
    tileLayer: {
        detectRetina: true
    }
})
    .setView([0, 0], 3);

function formatData(data) {
    var marker = L.marker([data.geo.ll[0], data.geo.ll[1]], {
        icon: L.icon({
            iconUrl: 'http://octoblu-devices.s3.amazonaws.com/octoblupin25.png',
            iconSize: ['25', '25'],
            iconAnchor: ['12', '12']
        })
    })
        .bindPopup('<div class="pad1 round clip tile fl">' +
                '<p class="small fr col9 white">' +
                    '<span class="display-block small">' +
                        '<span class="white inline">' + data.topic + '</span>' +
                        ' <span class="quiet inline"> @' + data.type + '</span>' +
                    '</span>' +
                    data.geo.city + ' ' +
                    data.geo.region + ' ' +
                    data.geo.country + ' ' +
                '</p>' +
            '</div>' + '')
        .addTo(map);

        marker.openPopup();

    setTimeout(function(){map.removeLayer(marker);}, 1000);

    // marker.on('popupopen', function() {
    //     $('.timeago').timeago();
    // });

    $('.loading').fadeOut();
}
