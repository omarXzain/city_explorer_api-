'use strict';
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
require('dotenv').config();
let pg = require('pg');
const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);

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



//=============================================//
function handleGettingLocations(req, res) {
  // get the data from the database ...
  client.query('SELECT * FROM Locations;').then(data => {
    res.send(data.rows);
  }).catch(err => {
    res.send('sorry .. an error occured ...', err);
  });
}

function handleAddingLocations(req, res) {
  const city = request.query.city;
  location = new Location(city, locationData.body[0]);
  let selecCity = 'SELECT * FROM location WHERE search_query = $1;';
  let cityVal = [city];
  client.query(selecCity, cityVal).then(result => {

    response.status(200).json(result.rows);

    let newLocation = 'INSERT INTO Locations(search_query,formatted_query,latitude,longitude) values ($1,$2,$3,$4) RETURNING *;';
    const ValuesInsert = [city, location.formatted_query, location.latitude, location.longitude];

    client.query(newLocation, ValuesInsert).then(DataX => {
      response.status(200).json(DataX);
    }).catch(() => {
      response.status(500).send('Something Went Wrong');
    });

  }
}
function handleWrongPaths(req, res) {
  res.status(404).send('page not found');
}


//==============================================//
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
  });
}).catch(err => {
  console.log('Sorry ... and error occured ..', err);
});

