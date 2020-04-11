# volunteer-map

https://digital-northampton.github.io/volunteer-map/

A visualisation of where people who have offered help during the COVID19 crisis are located

## Development

```sh
npm install;
npx serve;
# goto http://localhost:5000
```

## Deployment

Commits to the master branch are automatically deployed to Github Pages.

## Data sources

NN postcodes came from [Doogal](https://www.doogal.co.uk/UKPostcodes.php?Search=NN)

## Processing Data

```sh
npm install;
node process-raw-postcodes.js;
```
