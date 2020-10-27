
'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());

// %%%%%%%%%%%%%%%%%%%%%% Location Handler %%%%%%%%%%%%%%%%%%%%%%%
app.get('/location', (request, response) => {
  const city = request.query.city;
  const SQL = 'SELECT * FROM locations WHERE search_query = $1';
  const value = [city];
  client
    .query(SQL, value)
    .then((result) => {
      if (result.rows.length > 0) {
        response.status(200).json(result.rows[0]);
        console.log('hi im omar');
      } else {
        superagent(
          `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        ).then((res) => {
          console.log('helloooo');
          const geoData = res.body;
          const locationData = new Location(city, geoData);
          const SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4) RETURNING *';
          const value = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];

          client.query(SQL, value).then((result) => {
            console.log(result.rows);
            response.status(200).json(result.rows[0]);
          });
        });
      }
    }).catch((err) => errorHandler(err, request, response)
    );
});

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// %%%%%%%%%%%%%%%%%%%%%%% Weather Handler %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

app.get('/weather', (request, response) => {
  const city = request.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHER_API_KEY}`;
  superagent(url)
    .then((dataX) => {
      const weatherNow = dataX.body.data.map((weatherData) => {
        return new Weather(weatherData);
      });
      response.status(200).json(weatherNow);
    })
    .catch((error) => errorHandler(error, request, response));
});

function Weather(weatherData) {
  this.forecast = weatherData.weather.description;
  this.datetime = new Date(weatherData.valid_date);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Trails Handler %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


app.get('/trails', handleTrails);

function handleTrails(req, res) {

  let trailsKey = process.env.TRAIL_API_KEY;
  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${trailsKey}`)
    .then(data => {

      const trailsData = data.body.trails;
      res.send(trailsData);
      trailsData.map((constValue) => {

        return new Trails(constValue);

      });
    });
}
//%%%%%%%%%%%%%%%%%%%%%% Trails Function %%%%%%%%%%%%%%%%%%%%%%%
function Trails(trailData) {
  this.name = trailData.name;
  this.location = trailData.location;
  this.length = trailData.length;
  this.stars = trailData.stars;
  this.star_votes = trailData.star_votes;
  this.summary = trailData.summary;
  this.trail_url = trailData.trail_url;
  this.conditions = trailData.conditions;
  this.condition_date = trailData.condition_date;
  this.condition_time = trailData.condition_time;
}
// ###################### Error Handler ########################

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Make sure the server is listening
client.connect().then(() => {
  app.listen(PORT, () => { console.log(`You Successfully Connected To Port ${PORT}`); });
}).catch(err => {
  console.log('Sorry ... and error occured ..', err);
});

// #############################################################

