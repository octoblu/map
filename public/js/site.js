(function(){
    var ws, map, formatData, formatLocation, formatPopupHTML,
        addActivityToSidebar, showFromPopUp, showToPopUp, HIDE_DELAY;

    // How long to show an icon, popup, line before it disappears (in ms)
    HIDE_DELAY = 1000;

    ws = new WebSocket('ws://54.191.102.104');

    ws.onmessage = function(evt){
        var data;
        try{
            data = JSON.parse(evt.data);
        }
        catch(ex){
            console.log('JSONParseError:', evt.data);
        }

        if(data.geo){
            formatData(data);
        }
        console.log('evt', data);
    };

    map = L.mapbox.map('map', 'chrismatthieu.im763216', {
        tileLayer: {
            detectRetina: true
        }
    }).setView([0, 0], 3);


    formatData = function(data) {
        addActivityToSidebar(data);
        showFromPopUp(data);
        showToPopUp(data);

        $('.loading').fadeOut();
    };

    addActivityToSidebar = function(data) {
        var activityHTML;

        activityHTML =  '<span class="display-block small">' +
                            '<span class="white inline">' + data.topic + '</span>' +
                            '<span class="quiet inline"> @' + data.type + '</span>' +
                        '</span>' + formatLocation(data.geo);

        $("#activityData").prepend(activityHTML);
    };

    showFromPopUp = function(data) {
        var marker, popup;

        marker = buildMarker(data.geo);

        popup = L.popup();
        popup.setLatLng(L.latLng(data.geo.ll[0], data.geo.ll[1]));
        popup.setContent(formatPopupHTML(data, data.geo, 'Source'));

        map.addLayer(marker);
        map.addLayer(popup);

        setTimeout(function(){map.removeLayer(marker);}, HIDE_DELAY);
        setTimeout(function(){map.removeLayer(popup);},  HIDE_DELAY);
    };

    showToPopUp = function(data) {
        var marker, popup, line;
        if (!data.toGeo) {
            return;
        }

        marker = buildMarker(data.toGeo);

        popup = L.popup();
        popup.setLatLng(L.latLng(data.toGeo.ll[0], data.toGeo.ll[1]));
        popup.setContent(formatPopupHTML(data, data.toGeo, 'Destination'));

        var line = L.polyline([L.latLng(data.geo.ll[0], data.geo.ll[1]), L.latLng(data.toGeo.ll[0], data.toGeo.ll[1])], {color: 'blue'});

        map.addLayer(line);

        /* Maybe there is a better way to focus the view,
         panInsideBounds will move the map from one place to another
         if there is high activity */
        map.panInsideBounds(line.getBounds());

        map.addLayer(marker);
        map.addLayer(popup);
        setTimeout(function(){map.removeLayer(line);},   HIDE_DELAY);
        setTimeout(function(){map.removeLayer(marker);}, HIDE_DELAY);
        setTimeout(function(){map.removeLayer(popup);},  HIDE_DELAY);
    }

    buildMarker = function(geo) {
        return L.marker([geo.ll[0], geo.ll[1]], {
            icon: L.icon({
                iconUrl: 'http://octoblu-devices.s3.amazonaws.com/octoblupin25.png',
                iconSize: ['25', '25'],
                iconAnchor: ['12', '12']
            })
        });
    }

    formatLocation = function(geo) {
        return [
           geo.city,
           geo.region,
           geo.country
        ].join(' ');
    };

    formatPopupHTML = function(data, geo, info){
        return '' +
            '<div class="pad1 round clip tile fl">' +
                '<p class="small fr col9 white">' +
                    '<span class="display-block small">' +
                        '<span class="white inline">' + info + ': ' + data.topic + '</span>' +
                        '<span class="quiet inline"> @' + data.type + '</span>' +
                    '</span>' +
                    formatLocation(geo) +
                '</p>' +
            '</div>';
    };
})();
