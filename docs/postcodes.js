'use strict'

var data_url = "https://digital-northampton.github.io/volunteer-streets/codes.json"

$ (document).ready (function () {
  var $table = $("table#codes")
  var $button = $("button#download")

  var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var addRow = function (code, rowData) {
    var html = ""
    var hpv

    if (rowData.volunteers == 0) {
      hpv = "No Volunteers"
    } else {
      hpv = Math.round (rowData.households/rowData.volunteers)
    }

    html += "<tr>"
    html += "<td><h4>"+code+"</h4></td>"
    html += "<td>"+rowData.areas.sort().join(", ")+"</td>"
    html += "<td class='right'>"+numberWithCommas (rowData.households)+"</td>"
    html += "<td class='right'>"+numberWithCommas (rowData.population)+"</td>"
    html += "<td class='right'>"+numberWithCommas (rowData.volunteers)+"</td>"
    html += "<td class='right'>"+numberWithCommas (hpv)+"</td>"
    html += "/<tr>"

    $table.find ("tbody").append (html)
  }

  $.getJSON (data_url, function (data) {
    for (var code in data) {
      addRow (code, data[code])
    }
  })

  $button.bind ("click", function () {
    $table.first().table2csv({filename: 'postcodes.csv'});
  })
}) 