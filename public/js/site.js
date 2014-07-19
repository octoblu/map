var path = 'ws://54.191.102.104';
var ws = new WebSocket(path);

ws.onmessage = function(evt){
    try{
        var data = JSON.parse(evt.data);
        if(data.geo){

            /* testing destination
            data.toGeo = {"ll":[], "region":"", "city":"", "country":"" };
            data.toGeo.ll[0] = 33.5;
            data.toGeo.ll[1] = -112;
            data.toGeo.region = "AZ";
            data.toGeo.city = "Mesa";
            data.toGeo.country = "US";
            */


            formatData(data);
        }
        console.log('evt', data);

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


function updateSidebar(data)
{
    activity = '<span class="display-block small">' +
        '<span class="white inline">' + data.topic + '</span>' +
        '<span class="quiet inline"> @' + data.type + '</span>' +
        '</span>' +
        data.geo.city + ' ' +
        data.geo.region + ' ' +
        data.geo.country
    $("#activityData").prepend(activity);

}

function formatData(data) {

    var marker = L.marker([data.geo.ll[0], data.geo.ll[1]], {
        icon: L.icon({
            iconUrl: 'http://octoblu-devices.s3.amazonaws.com/octoblupin25.png',
            iconSize: ['15', '15'],
            iconAnchor: ['12', '12']
        })
    });
    var fromPopUp = L.popup();
    fromPopUp.setLatLng(L.latLng(data.geo.ll[0], data.geo.ll[1]));
    fromPopUp.setContent('<div class="pad1 round clip tile fl">' +
            '<p class="small fr col9 white">' +
            '<span class="display-block small">' +
            '<span class="white inline">' + data.topic + '</span>' +
            ' <span class="quiet inline"> @' + data.type + '</span>' +
            '</span>' +
            data.geo.city + ' ' +
            data.geo.region + ' ' +
            data.geo.country + ' ' +
            '</p>' +
            '</div>' + '');



    if (data.toGeo) {
        var destMarker = L.marker([data.toGeo.ll[0], data.toGeo.ll[1]], {
            icon: L.icon({
                iconUrl: 'http://octoblu-devices.s3.amazonaws.com/octoblupin25.png',
                iconSize: ['15', '15'],
                iconAnchor: ['12', '12']
            })
        });

        var destPopUp = L.popup();
        destPopUp.setLatLng(L.latLng(data.toGeo.ll[0], data.toGeo.ll[1]));
        destPopUp.setContent('<div class="pad1 round clip tile fl">' +
            '<p class="small fr col9 white">' +
            '<span class="display-block small">' +
            '<span class="white inline">Dest:' + data.topic + '</span>' +
            '<span class="quiet inline"> @' + data.type + '</span>' +
            '</span>' +
            data.toGeo.city + ' ' +
            data.toGeo.region + ' ' +
            data.toGeo.country + ' ' +
            '</p>' +
            '</div>' + '');

        var fromTo = L.polyline([L.latLng(data.geo.ll[0], data.geo.ll[1]), L.latLng(data.toGeo.ll[0], data.toGeo.ll[1])], {color: 'blue'});



    }

    map.addLayer(marker);
    map.addLayer(fromPopUp);
    updateSidebar(data);

    setTimeout(function(){map.removeLayer(marker);}, 1000);
    setTimeout(function(){map.removeLayer(fromPopUp);}, 1000);

    if (data.toGeo) {
        map.addLayer(fromTo);

        /* Maybe there is a better way to focus the view,
         panInsideBounds will move the map from one place to another
         if there is high activity */
        map.panInsideBounds(fromTo.getBounds());

        map.addLayer(destMarker);
        map.addLayer(destPopUp);
        setTimeout(function(){map.removeLayer(fromTo);}, 1000);
        setTimeout(function(){map.removeLayer(destMarker);}, 1000);
        setTimeout(function(){map.removeLayer(destPopUp);}, 1000);

    }


    $('.loading').fadeOut();
}
