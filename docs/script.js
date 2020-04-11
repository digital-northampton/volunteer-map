
var dataUrl = "https://digital-northampton.github.io/volunteer-map/volunteers.json"
var OpenStreetMap_Mapnik
var map
var layerGroup;
var data

var updateMap = function (markers, circles, radius) {

  layerGroup.clearLayers ()

  var markerCount = 0

  data.forEach (function (volunteer) {
    console.log (volunteer)

    markerCount++

    if (markers === true) {
      var marker = L.marker ([volunteer.lat, volunteer.lng]).addTo (layerGroup);
      marker.bindPopup (volunteer.postcode);
    }

    if (circles === true) {
      L.circle (
       [volunteer.lat, volunteer.lng],
       radius,
       {stroke:false}).addTo (layerGroup);
    }
  });

  $ (".postcodes-count").html (markerCount)
}

$ (document).ready (function () {
  $.getJSON (dataUrl, function (_data) {
    data = _data
    
    var $pins = $ ("input#pins")
    var $circle = $ ("input#circle")
    var $radius = $ ("input#radius")
    var $update = $ ("a.update")

    var lat = 52.240479
    var lng = -0.902656

    map = L.map('map').setView ([lat, lng], 10)
    layerGroup = L.layerGroup().addTo(map);

    $update.bind ("click", function () {
      updateMap (
        $pins.is(':checked'),
        $circle.is(':checked'),
        parseInt ($radius.val ()))
    })

    OpenStreetMap_Mapnik = L.tileLayer (
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      {
        attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    ).addTo (map)

    L
      .control
      .scale ({ maxWidth : 240, metric : true, position : 'bottomleft'})
      .addTo (map)

    updateMap (false, true, 500)
  })

})
