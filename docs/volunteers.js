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
    for (var s = 0; s < volunteer.streets.length; s++) {
      var html = ""

      var url = "volunteer.html?postcode=" + encodeURI (volunteer.postcode)

      html += "<tr>"
      html += "<td>"+volunteer.postcode+"</a></td>"
      html += "<td>"+volunteer.streets [s]+"</td>"
      html += "</tr>"

      $table.find ("tbody").append (html)
    }
  }

  $.getJSON (data_url, function (data) {
    data.forEach (volunteer => {
      addRow (volunteer)
    })
  })

  $button.bind ("click", function () {
    $table.first().table2csv({filename: 'volunteers.csv'});
  })
}) 
