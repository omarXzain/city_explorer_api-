'use strict';
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT;
app.use(cors());

app.get('/location', handleLocation);

function handleLocation(req, res) {
  let city = req.query.city;
  let geoKey = process.env.GEOCODE_API_KEY;


  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${geoKey}&q=${city}&format=json`)
    .then((data) => {
      const geoData = data.body[0];
      // res.send(data);
      let locationObject = new Location(city, geoData.display_name, geoData.lat, geoData.lon);
      res.status(200).json(locationObject);
    }).catch(console.error);
}

// constructor
function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

//==============================================//

app.get('/weather', handleWeather);



function handleWeather(req, res) {

  let weatherArr = [];
  let search_query = req.query.search_query;
  let weatherKey = process.env.WEATHER_API_KEY;


  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${weatherKey}`)
    .then((dataX) => {

      dataX.body.data.map(rain => {
        const newWeather = new Weather(search_query, rain);
        weatherArr.push(newWeather);
      });
      res.send(weatherArr);
    }).catch(console.error);
}

function Weather(search_query, rain) {
  this.search_query = search_query;
  this.forecast = rain.weather.description;
  this.time = rain.datetime;
}


//==================================================//
// Trails

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


app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
