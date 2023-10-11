// Store our API endpoint as queryUrl. M15, D1, A10
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

// function for features
function createFeatures(earthquakeData) {

    console.log(earthquakeData[0].properties.mag)
    console.log(earthquakeData[0].geometry.coordinates[0])
    console.log(earthquakeData[0].geometry.coordinates[1])

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<hr><p>${feature.properties.mag}</p>`);
  }

    function pointToLayer(feature, coordinates){
      return L.circleMarker(coordinates, {
        fillColor: quakeDepth(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: quakeDepth(feature.geometry.coordinates[2]),
        radius: feature.properties.mag * 5
      })
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
};

function quakeDepth(depth) {
  if (depth >= 100) {
    return "red";
  } else if (depth >= 80) {
    return "orange";
  } else if (depth >= 50) {
    return "yellow";
  } else if (depth >= 30) {
    return "green";
  } else if (depth >= 20) {
    return "blue";
  } else if (depth >= 10) {
    return "purple";
  } else {
    return "pink";
  }
}


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  let legend = L.control({
    position: "bottomright"
    })
  legend.onAdd = function(){
    let container = L.DomUtil.create("div", "legend")
    let depths = [0,10,20,30,50,80,100]
      for (let d of depths) {
        container.innerHTML += `<div><div class = "lbox" style = "background-color: ${quakeDepth(d)}" ></div><p>  depth >= ${d}</p></div>`
      }
    return container
  }
  legend.addTo(myMap)
}