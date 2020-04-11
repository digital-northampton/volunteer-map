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
const batch_size = 5

let postcodeLocations
let volunteerLocations

var output_file = fs.openSync (output_path, 'w');

const loadPostCodeLoacations = () => {
  return new Promise ((resolve, reject) => {
    fs.readFile (location_lookup_path, (error, data) => {
        if (error) {
          reject (error);
        } else {
          (async () => {
            postcodeLocations = await neatCsv (data);
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
            const volunteerPostCodes = await neatCsv (data)
            volunteerLocations = volunteerPostCodes
                                  .map (r => r.address_personal_postcode)
                                  .filter (r => r != "" && r != undefined)
                                  .map (r => r.toUpperCase ())
                                  .map (r => r.replace(/ /g,''))
                                  .map (r => r.slice (0,-3) + " " + r.slice (r.length - 3))
                                  .sort ()
                                  .map (postcode => Object.assign ({postcode}, {lat:false, lng:false}))
            
            resolve ()
          })()
        }
    })
  })
}

const setCoordinatesFromLocal = () => {
  return new Promise ((resolve, reject) => {
    volunteerLocations.map (vl => {
      const location = postcodeLocations.find (pcl => vl.postcode == pcl.postcode)
      
      if (location !== undefined) {
        vl.lat = location.lat
        vl.lng = location.lng
      }

      return vl  
    })
    resolve ()
  })
}

const setCoordinatesFromAPI = () => {
  return new Promise ((resolve, reject) => {
    const awaitingCoordinates = volunteerLocations
                                   .filter (l => l.lat == false || l.lng == false)
    
    const url = api_url+encodeURI (awaitingCoordinates.slice (0, batch_size).map (c => c.postcode).join (","))

    https.get (url, (resp) => {
      let data = '';

      resp.on ('data', (chunk) => data += chunk)

      resp.on ('end', () => {
        if (parser.validate (data) === true) {
          var jsonObj = parser.parse (data)
          
          const newLine = "\n" + jsonObj.kml.Document.Placemark
                            .map (p => {
                              return p.name + "," + p.Point.coordinates
                            })
                            .join ("\n")
          
          fs.appendFileSync (location_lookup_path, newLine);
        }
      })
    }).on ("error", (err) => {
      console.log("Error: " + err.message)
    })

    const pc = 100-Math.round (100 * awaitingCoordinates.length / volunteerLocations.length)
    if (pc == 100) {
      console.log ("🔥")
    } else {
      console.log (pc + "% locations assigned. Run again.")
    }

    resolve ()
  })
}

loadPostCodeLoacations ()
  .then (loadVolunteerPostCodes)
  .then (setCoordinatesFromLocal)
  .then (setCoordinatesFromAPI)
  .catch (e => console.log (e))
