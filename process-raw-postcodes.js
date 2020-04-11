"use strict";

const neatCsv = require ('neat-csv')
const fs = require ('fs')
const https = require ('https')
const _ = require ('underscore')
const parser = require ('fast-xml-parser')

const raw_file_path = "data/raw.csv"
const location_lookup_path = "data/postcode-locations.csv"
const output_path = "data/voluteer-locations.csv"
const api_url = "https://www.doogal.co.uk/MultiplePostcodesKML.ashx?postcodes="

let postcodeLocations
let volunteerPostCodes

var output_file = fs.openSync (output_path, 'w');

const loadPostCodeLoacations = () => {
  return new Promise ((resolve, reject) => {
    fs.readFile (location_lookup_path, (error, data) => {
        if (error) {
          reject (error);
        } else {
          (async () => {
            volunteerPostCodes = await neatCsv (data);
            resolve ();
          })();
        }
    });
  })
}

const loadVolunteerPostCodes = () => {
  return new Promise ((resolve, reject) => {
    fs.readFile (raw_file_path, (error, data) => {
        if (error) {
          reject (error);
        } else {
          (async () => {
            volunteerPostCodes = await neatCsv (data)
            volunteerPostCodes = volunteerPostCodes
                                  .map (r => r.address_personal_postcode)
                                  .filter (r => r != "" && r != undefined)
                                  .map (r => r.toUpperCase ())
                                  .map (r => r.replace(/ /g,''))
                                  .map (r => r.slice (0,-3) + " " + r.slice (r.length - 3))
                                  .sort ()
            resolve ();
          })();
        }
    });
  })
}

loadPostCodeLoacations ()
  .then (loadVolunteerPostCodes)
  .then (() => console.log ("🔥"))
  .catch (e => console.log (e))

return;

const processCsvFile = data => {
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

