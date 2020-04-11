# volunteer-map

https://digital-northampton.github.io/volunteer-map/

A visualisation of where people who have offered help during the COVID19 crisis are located

## Development

```sh
npm install;
npx serve;
```

The site will be at `http://localhost:5000/docs/`

## Deployment

Commits to the master branch are automatically deployed to Github Pages.

## Data sources

Postcode Coordinate data came from the [Doogal](https://www.doogal.co.uk) API.

note the raw volunteer file was supplied in TSV format even though the extension was `.csv`. [Use this](https://onlinetsvtools.com/convert-tsv-to-csv) to convert the data. 

County border from [Open Street Map](https://www.openstreetmap.org/relation/63375#map=10/52.2992/-0.7855) via [Overpass](http://overpass-turbo.eu). (see [this post](https://help.openstreetmap.org/questions/23679/how-to-export-a-route-relation-as-gpx-or-kml)).

## Processing Data

```sh
npm install;
node process-raw-postcodes.js;
```
