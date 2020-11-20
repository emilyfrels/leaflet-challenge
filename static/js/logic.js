//function to create map

console.log("logic_3.js for leaflet homework");

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
console.log(`var queryUrl = ${queryUrl}`);

var myMap;



// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});

// create function to determine marker size based on magnitude of earthquake
function markerSize(magnitude) {
  // multiply magnitude by a large number so we can actually see it on the map
  return magnitude * 25000;
}

// function to create features on map
function createFeatures(earthquakeData) {


  // define function to run on each feature in features array
  function onEachFeature(feature, layer) {

    // bind popup with additional detail to each marker
    layer.bindPopup("<h3>Earthquake Details</h3><hr><strong>Location: </strong>" + feature.properties.place + "<br><strong>Magnitude: </strong>" + feature.properties.mag + "<br><strong>Date/Time: </strong>" + new Date(feature.properties.time));


  }

  // create geojson layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,


    // define radius based on marker size and opacity based on depth of earthquake
    // refered to this website for help on pointToLayer: https://leafletjs.com/examples/geojson/
    pointToLayer: function(feature, latlng) {
      return new L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: '#EA0F23',
        color: '#EA0F23',
        opacity: feature.geometry.coordinates[2]
      });
    }
    
  });




  // send earthquakes layer to createMap function
  createMap(earthquakes);
}


// function to create map with earthquake data
function createMap(earthquakes) {

// define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // create darkmap tile layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });


  // define basemap object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  
  // define overlay object
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  
  // create map
  var myMap = L.map('map', {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
});
  

  // create layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
