// Create map object
let map = L.map('map').setView([0, 0], 2); // Centered at latitude 0, longitude 0 with zoom level 2

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier as needed
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? '#FF0000' : // Red for depth > 90
           depth > 70 ? '#FF7F00' : // Orange for depth > 70
           depth > 50 ? '#FFFF00' : // Yellow for depth > 50
           depth > 30 ? '#7FFF00' : // Light Green for depth > 30
           depth > 10 ? '#00FF00' : // Green for depth > 10
           depth >= -10 ? '#008080' : // Teal for depth between -10 and 10
           '#0000FF'; // Blue for depths below -10
}

// Fetch earthquake data from the GeoJSON API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through the GeoJSON data
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];
            var popupContent = `<strong>Location:</strong> ${feature.properties.place}<br>
                                <strong>Magnitude:</strong> ${magnitude}<br>
                                <strong>Depth:</strong> ${depth} km`;

            // Code for circle marker for each earthquake
            L.circleMarker([coords[1], coords[0]], {
                radius: getMarkerSize(magnitude),
                fillColor: getColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(popupContent).addTo(map);
        });

        // Legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [-10, 10, 30, 50, 70, 90];
            var labels = ['<strong>Depth (km)</strong>'];

            // Loop through depth intervals and create a colored legend
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }
            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));