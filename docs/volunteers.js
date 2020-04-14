'use strict'

var data_url = "https://digital-northampton.github.io/volunteer-streets/volunteers.json"
var postcode = ""
var $table = $("table#volunteers")
var $button = $("button#download")
var $form = $("form#radius")
var radius = 1000
var data 
var last_postcode

var addRow = function (volunteer, s) {
  var newCode = volunteer.postcode !== last_postcode
  var html = ""
  var title = newCode ? volunteer.postcode : ""
  var ids = volunteer.streets[s].ids == undefined ? "" : volunteer.streets[s].ids.join (", ") 

  html += "<tr class='"+(newCode?"new-code":"")+"'>"
  html += "<td><strong>"+title+"</strong></td>"
  html += "<td>"+volunteer.streets [s].name+"</td>"
  html += "<td>"+numberWithCommas (volunteer.streets [s].distance)+"</td>"
  html += "<td class='ids'>"+ids+"</td>"
  html += "</tr>"

  $table.find ("tbody").append (html)

  last_postcode = volunteer.postcode
}

var numberWithCommas = function (x) {
  if (x == undefined) {
    return "";
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var updateTable = function () {
  last_postcode = ""
  $table.find ("tbody").html ("")
  var unassignedStreets = [];

  data.forEach (volunteer => {
    if (volunteer.streets.length == 0) {
      volunteer.streets.push ({name:" "})
    }

    for (var s = 0; s < volunteer.streets.length; s++) {
      var distance = parseInt (volunteer.streets [s].distance)
      if (! Number.isInteger (distance)) {
        distance = 0
      }
      if (distance > radius) {
        //
      } else {
        addRow (volunteer, s)
      }
    }
  })
}

$ (document).ready (function () {
  var $table = $("table#volunteers")
  var $button = $("button#download")

  $.getJSON (data_url, function (_data) {
    data = _data
    updateTable ()
    $ (".hidden").removeClass ("hidden");
    $ (".loading").addClass ("hidden");
  })

  $form.find ("#set-radius").bind ("click", function (e) {
    var new_radius = $form.find ("input#radius").val ()
    if (Number.isInteger (parseInt (new_radius))) {
      radius = new_radius
      updateTable ()
    }

    e.preventDefault();
    return false;
  })

  $button.bind ("click", function () {
    $table.first().table2csv({filename: 'volunteers.csv'});
  })
}) 
