'use strict';
/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT;
app.use(cors());

const { response, json } = require('express');

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

    });
  // let jsonObject = jsonData[0];

}

function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}
// {
//   "search_query": "seattle",
//   "formatted_query": "Seattle, WA, USA",
//   "latitude": "47.606210",
//   "longitude": "-122.332071"
// }



//===========================================

app.get('/weather', handleWeather);



function handleWeather(req, res) {
  let dataArr = [];
  let jsonData = require('./data/weather.json');

  try {
    for (let i = 0; i < jsonData.data.length; i++) {
      let locationObject = new Weather(jsonData.data[i].weather.description, jsonData.data[i].valid_date);
      dataArr.push(locationObject);
    }
    res.status(200).json(dataArr);
  } catch (error) {
    res.status(500).send('something went wrong!');
  }

}
function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}




app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
