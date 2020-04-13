'use strict'

var data_url = "https://digital-northampton.github.io/volunteer-streets/volunteers.json"
var postcode = ""
$ (document).ready (function () {
  var $table = $("table#volunteers")
  var $button = $("button#download")
  var last_postcode = ""

  var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var addRow = function (volunteer) {

    if (volunteer.streets.length == 0) {
      volunteer.streets.push (" ")
    }

    for (var s = 0; s < volunteer.streets.length; s++) {
      var html = ""

      var url = "volunteer.html?postcode=" + encodeURI (volunteer.postcode)
      var newCode = volunteer.postcode !== last_postcode
      var title = newCode ? volunteer.postcode : ""

      html += "<tr class='"+(newCode?"new-code":"")+"'>"
      html += "<td><strong>"+title+"</strong></td>"
      html += "<td>"+volunteer.streets [s]+"</td>"
      html += "</tr>"

      $table.find ("tbody").append (html)

      last_postcode = volunteer.postcode
    }
  }

  $.getJSON (data_url, function (data) {
    data.forEach (volunteer => {
      addRow (volunteer)
    })

    $ (".loading").hide ();
  })

  $button.bind ("click", function () {
    $table.first().table2csv({filename: 'volunteers.csv'});
  })
}) 
