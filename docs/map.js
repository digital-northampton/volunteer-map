
var dataUrl = "https://digital-northampton.github.io/volunteer-map/volunteers.json"
var borderUrl = "https://digital-northampton.github.io/volunteer-map/county-border.gpx"
var OpenStreetMap_Mapnik
var map
var circleGroup;
var markerGroup;
var data

var numberWithCommas = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var updateMap = function (markers, circles, radius) {

  markerGroup.clearLayers ()
  circleGroup.clearLayers ()

  var markerCount = 0

  data.forEach (function (volunteer) {
    markerCount++

    if (markers === true) {
      var marker = L.marker ([volunteer.lng, volunteer.lat]).addTo (markerGroup);
      marker.bindPopup (volunteer.postcode);
    }

    if (circles === true) {
      L.circle (
       [volunteer.lng, volunteer.lat],
       radius,
       {stroke:false}).addTo (circleGroup);
    }
  });

  $ (".volunteer-count").html (numberWithCommas (markerCount))
}

$ (document).ready (function () {
  $.getJSON (dataUrl, function (_data) {
    data = _data
    
    var $pins = $ ("input#pins")
    var $circle = $ ("input#circle")
    var $radius = $ ("input#radius")
    var $update = $ ("a.update")
    var $controls = $ (".controls")
    var $close = $ (".close-controls")
    var $open = $ (".open-controls")

    var lat = -0.902656
    var lng = 52.240479

    map = L.map('map').setView ([lng, lat], 10)

    $update.bind ("click", function () {
      updateMap (
        $pins.is(':checked'),
        $circle.is(':checked'),
        parseInt ($radius.val ()))
    })

    OpenStreetMap_Mapnik = L.tileLayer (
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      {
        maxZoom: 18,
        attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    ).addTo (map)

    L
      .control
      .scale ({ maxWidth : 240, metric : true, position : 'bottomleft'})
      .addTo (map)

    markerGroup = L.markerClusterGroup().addTo(map);
    circleGroup = L.layerGroup().addTo(map);

    new L.GPX (borderUrl, {async: true}).on('loaded', function(e) {
      map.fitBounds(e.target.getBounds());
    }).addTo(map)

    updateMap (true, false, 500)

    $close.bind ("click", function () {
      $controls.addClass ("hidden")
    })

    $open.bind ("click", function () {
      $controls.removeClass ("hidden")
    })
  })
})
