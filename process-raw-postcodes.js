"use strict";

const neatCsv = require ('neat-csv')
const fs = require ('fs')
const https = require ('https')
const _ = require ('underscore')
const parser = require ('fast-xml-parser')

const raw_file_path = "data/raw.csv"
const output_path = "data/voluteer-locations.csv"
const api_url = "https://www.doogal.co.uk/MultiplePostcodesKML.ashx?postcodes="
const locations = []

var output_file = fs.openSync (output_path, 'w');

const processCsvFile = data => {
  const postcodes = data
                .map (r => r.address_personal_postcode)
                .filter (r => r != "" && r != undefined)
                .map (r => r.toUpperCase ())
                .map (r => r.replace(/ /g,''))
                .map (r => r.slice (0,-3) + " " + r.slice (r.length - 3))
                .sort ()

  const chunked_postcodes = _.chunk (postcodes, 40)

  const url = api_url + encodeURI (chunked_postcodes[0].join (","))

  https.get (url, (resp) => {
    let data = '';

    resp.on ('data', (chunk) => data += chunk)

    resp.on ('end', () => {
      if (parser.validate (data) === true) {
        var jsonObj = parser.parse (data);
        
        const newLine = jsonObj.kml.Document.Placemark
                          .map (p => p.name + "," + p.Point.coordinates)
                          .join ("\n")
        
        fs.appendFileSync (output_file, newLine);
      }
    })
  }).on ("error", (err) => {
    console.log("Error: " + err.message)
  })
}

fs.readFile (raw_file_path, async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  
  processCsvFile (await neatCsv(data))
})
