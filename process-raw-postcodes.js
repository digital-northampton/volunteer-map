"use strict";

const neatCsv = require ('neat-csv')
const fs = require ('fs')

const processCsvFile = data => {
  const postcodes = data
                      .map (r => r.address_personal_postcode)
                      .filter (r => r != "" && r != undefined)
                      .map (r => r.toUpperCase ())
                      .map (r => r.replace(/ /g,''))
                      .map (r => r.slice (0,-3) + " " + r.slice (r.length - 3))

  console.log (postcodes)
}


fs.readFile('data/raw.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  
  processCsvFile (await neatCsv(data))
})