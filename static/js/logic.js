// console.log because we can
console.log("logic.js for leaflet homework");

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// console.log the query url for easy access to check JSON
console.log(`var queryUrl = ${queryUrl}`);


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);


  // console.log to make sure we're pulling in data from the query url
  console.log(data.features);
});



// create function to determine marker size based on magnitude of earthquake
function markerSize(magnitude) {

  // multiply magnitude by a large number so we can actually see it on the map
  return magnitude * 25000;
  
}


// create function to determine color based on depth of earthquake
function getColor(depth) {

    return  depth < 3 ? '#8BC34A': // color will be green if depth is less than 3
            depth < 5 ? '#FFEB3B': // color will be yellow if depth is less than 5
            depth < 7 ? '#FF8F00': // color will be orange if depth is less than 7
            depth < 9 ? '#FF5722': // color will be dark orange if depth is less than 9
            depth < 11 ? '#FF0033': // color will be red if depth is less than 11
            depth > 11 ? '#6A1B9A': // color will be purple if depth is greater than 11
            '#FAFAFA'; // if nothing else, return white
}



// function to create features on map
function createFeatures(earthquakeData) {


  // define function to run on each feature in features array
  function onEachFeature(feature, layer) {

    // bind popup with additional detail to each marker
    layer.bindPopup("<h3>Earthquake Details</h3><hr><strong>Location: </strong>" + feature.properties.place + "<br><strong>Magnitude: </strong>" + feature.properties.mag + "<br><strong>Date/Time: </strong>" + new Date(feature.properties.time) + "<br><strong>Depth: </strong>" + feature.geometry.coordinates[2]);
  }



  // create geojson layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,


    // define radius based on marker size and opacity based on depth of earthquake
    // refered to this website for help on pointToLayer: https://leafletjs.com/examples/geojson/
    pointToLayer: function(feature, latlng) {
      return new L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: getColor(feature.geometry.coordinates[2]),
        opacity: 5
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


  // create legend
  var legend = L.control({
    position: 'bottomright'
  });

  // when layer control is added, insert div with class of legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h3>Depth of Earthquake</h3>",

      // found some help in this article for this section: https://www.igismap.com/legend-in-leafletjs-map-with-topojson/
      categories = [-1,3,5,7,9,11];

      for (var i=0; i < categories.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(categories[i] + 1 ) + '"></i>' + categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>':'+');

      }
    return div;
  }

  legend.addTo(myMap);


}
