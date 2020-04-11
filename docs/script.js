
var dataUrl = "https://digital-northampton.github.io/volunteer-map/volunteers.json"
var OpenStreetMap_Mapnik
var map
var layerGroup;

var updateMap = function (markers, circles, radius) {

  layerGroup.clearLayers();

  var markerCount = 0

  volunteerPostCodes.forEach (function (volunteerPostCode) {
    var coordinatesStr = allPostCodes[volunteerPostCode.toUpperCase ()]
    if (coordinatesStr == undefined) {
      return
    }

    markerCount++
    var coordinates = coordinatesStr.split (",")

    if (markers === true) {
      var marker = L.marker ([coordinates[0], coordinates[1]]).addTo (layerGroup);
      var start = volunteerPostCode.substr (0, volunteerPostCode.length-3)
      var end = volunteerPostCode.substr (-3)
      marker.bindPopup (start + " " + end);
    }

    if (circles === true) {
      L.circle (
       [coordinates[0], coordinates[1]],
       radius,
       {stroke:false}).addTo (layerGroup);
    }
  });

  $ (".postcode-count").html (markerCount)
  $ (".total-count").html (volunteerPostCodes.length)
}

$ (document).ready (function () {
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

