let myMap = L.map("map").setView([40.86, -120.102], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier as needed for appropriate sizing
}

// Define function to determine marker color based on depth
function getMarkerColor(depth) {
    if (depth < 10) {
        return "lime";
    } else if (depth < 30) {
        return "green";
    } else if (depth < 50) {
        return "yellow";
    } else if (depth < 70) {
        return "orange";
    } else if (depth < 90) {
        return "pink";
    } else {
        return "red";
    }
}

// Fetch JSON data and add markers to the map
d3.json(url).then(function(response) {
    L.geoJson(response, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Magnitude:</b> ${feature.properties.mag}<br><b>Depth:</b> ${feature.geometry.coordinates[2]} km`);
        }
    }).addTo(myMap);
});

// Create legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["lime", "green", "yellow", "orange", "pink", "red"];
    let labels = ["<10 km", "10-30 km", "30-50 km", "50-70 km", "70-90 km", "90+ km"];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(myMap);
