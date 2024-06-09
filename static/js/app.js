// Store API endpoint as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function(data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: coloroptions(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Marker color function
    function coloroptions(depth) {
        if (depth < 10) return "#D11141";
        else if (depth < 30) return "#00B159";
        else if (depth < 50) return "#00aedb";
        else if (depth < 70) return "#f37735";
        else if (depth < 90) return "#ffc425";
        else return "#ffffff";
    }

    // Magnitude size function
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;  
        }
        return mag * 4;
    }

    // Add earthquakeData to map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,

        // Create popup layer
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // Add Legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + coloroptions(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});
