"use strict";

const neatCsv = require ('neat-csv')
const fs = require ('fs')

const processCsvFile = data => {
  console.log (data)
}

fs.readFile('data/raw.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  
  processCsvFile (await neatCsv(data))
})