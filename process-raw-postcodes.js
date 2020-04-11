"use strict";

const neatCsv = require ('neat-csv')
const fs = require ('fs')
const https = require ('https')
const _ = require ('underscore')

const api_url = "https://www.doogal.co.uk/MultiplePostcodesKML.ashx?postcodes="

let locations

const processCsvFile = data => {
  const postcodes = data
                .map (r => r.address_personal_postcode)
                .filter (r => r != "" && r != undefined)
                .map (r => r.toUpperCase ())
                .map (r => r.replace(/ /g,''))
                .map (r => r.slice (0,-3) + " " + r.slice (r.length - 3))
                .sort ()

  const chunked_postcodes = _.chunk (postcodes, 10)

  console.log (chunked_postcodes[0]) 
}

fs.readFile('data/raw.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  
  processCsvFile (await neatCsv(data))
})


// https.get (api_url + "NN1%201SY,NN1%203RP", (resp) => {
//   let data = '';

//   // A chunk of data has been recieved.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(data);
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });

// 