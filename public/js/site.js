(function(){
    var ws, map, processMessage, formatLocation, formatPopupHTML,
        addActivityToSidebar, showFromPopUp, showToPopUp, showFromToLine, HIDE_DELAY;

    // How long to show an icon, popup, line before it disappears (in ms)
    HIDE_DELAY = 2000;

    ws = new WebSocket('ws://activity.octoblu.com');

    ws.onmessage = function(evt){
        var data;
        try{
            data = JSON.parse(evt.data);
        }
        catch(ex){
            console.log('JSONParseError:', evt.data);
        }

        try {
            processMessage(data);
        } catch(ex) {
            console.log('Error displaying data', data);
        }

        console.log('evt', data);
    };

    map = L.mapbox.map('map', 'chrismatthieu.im763216', {
        tileLayer: {
            detectRetina: true
        }
    }).setView([0, 0], 5);


    processMessage = function(data) {
        if(!data.geo){return;}

        addActivityToSidebar(data);
        showFromPopUp(data);

        if(data.toGeo) {
            showToPopUp(data);
            showFromToLine(data.geo, data.toGeo);
        }

        $('.loading').fadeOut();
    };

    addActivityToSidebar = function(data) {
        $("#activityData").prepend(formatActivityHTML(data));

        // remove activity from bottom
        if($("#activityData > div").length > 15){
            $("#activityData div:last-child").remove();
        }
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

        marker = buildMarker(data.toGeo);

        popup = L.popup();
        popup.setLatLng(L.latLng(data.toGeo.ll[0], data.toGeo.ll[1]));
        popup.setContent(formatPopupHTML(data, data.toGeo, 'Destination'));

        map.addLayer(marker);
        map.addLayer(popup);

        setTimeout(function(){map.removeLayer(marker);}, HIDE_DELAY);
        setTimeout(function(){map.removeLayer(popup);},  HIDE_DELAY);
    };

    showFromToLine = function(fromGeo, toGeo){
        var line = L.polyline([L.latLng(fromGeo.ll[0], fromGeo.ll[1]), L.latLng(toGeo.ll[0], toGeo.ll[1])], {color: 'blue'});
        map.addLayer(line);
        /* Maybe there is a better way to focus the view,
         panInsideBounds will move the map from one place to another
         if there is high activity */
        // map.panInsideBounds(line.getBounds());
        setTimeout(function(){map.removeLayer(line);},   HIDE_DELAY);
    };

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

    formatActivityHTML = function(data){
        return  '<div class="display-block small ">' +
                    '<span class="white inline">' + data.topic + '</span> - ' +
                    '<span class="quiet inline"> @' + data.type + '</span>' +
                    '<br/>' + formatLocation(data.geo) +
                '</div>';
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
