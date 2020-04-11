"use strict";

const neatCsv = require ('neat-csv');
const csv = 'type,part\nunicorn,horn\nrainbow,pink';

(async () => {
  console.log(await neatCsv(csv));
})();