// 'use strict';
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
// require('dotenv').config();
// let pg = require('pg');
// const express = require('express');
// const app = express();
// const superagent = require('superagent');
// const cors = require('cors');
// const PORT = process.env.PORT;

// // DATABASE Settings
// const DATABASE_URL = process.env.DATABASE_URL;
// let client = new pg.Client(DATABASE_URL);

// // how to use cors
// app.use(cors());
// app.get('/location', handleLocation);

// function handleLocation(req, res) {
//   let city = req.query.city;


//   getfromDataBase(city).then(result => {
//     if (result.rowCount > 0) {
//       res.json(result.rowCount > 0)
//     } else {
//       getLocationFromAPI(city, res).then(data => {
//         addLocationTodataBase(data);
//         res.json(data);
//       });
//     }
//   });



//   function getfromDataBase(city, res) {
//     let queryX = 'SELECT * FROM locations WHERE search_query = $1';
//     let values = [city];

//     return client.query(queryX, values).then(result => {
//       return result;
//     });
//   }
//   function addLocationTodataBase(locationObject) {

//     // insert data to database before returning it
//     let query1 = 'INSERT INTO locations)search_query,formatted_query, latitude,longitude) VALUES ($1, $2, $3, $4) ;';
//     let values1 = [locationObject.city, data.display_name, data.lat, data.lon];

//     client.query(query1, values1).then(() => {
//       console.log('recoooorded right');
//     }).catch(() => {
//       res.send('eroooooooor......');
//     });
//   }

//   function getLocationFromAPI(city) {
//     let geoKey = process.env.GEOCODE_API_KEY;
//     return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${geoKey}&q=${city}&format=json`)
//       .then((data) => {
//         const geoData = data.body[0];
//         // res.send(data);
//         let locationObject = new Location(city, geoData.display_name, geoData.lat, geoData.lon);

//         return locationObject;
//       }).catch(console.error);
//   }
// }
// // constructor
// function Location(search_query, formatted_query, latitude, longitude) {
//   this.search_query = search_query;
//   this.formatted_query = formatted_query;
//   this.latitude = latitude;
//   this.longitude = longitude;
// }

// //==============================================//

// app.get('/weather', handleWeather);

// function handleWeather(req, res) {

//   let weatherArr = [];
//   let search_query = req.query.search_query;
//   let weatherKey = process.env.WEATHER_API_KEY;


//   superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${weatherKey}`)
//     .then((dataX) => {

//       dataX.body.data.map(rain => {
//         const newWeather = new Weather(search_query, rain);
//         weatherArr.push(newWeather);
//       });
//       res.send(weatherArr);
//     }).catch(console.error);
// }

// function Weather(search_query, rain) {
//   this.search_query = search_query;
//   this.forecast = rain.weather.description;
//   this.time = rain.datetime;
// }


// //==================================================//
// // Trails

// app.get('/trails', handleTrails);

// function handleTrails(req, res) {

//   let trailsKey = process.env.TRAIL_API_KEY;
//   superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${trailsKey}`)
//     .then(data => {

//       const trailsData = data.body.trails;
//       res.send(trailsData);
//       trailsData.map((constValue) => {

//         return new Trails(constValue);

//       });
//     });
// }

// function Trails(trailData) {
//   this.name = trailData.name;
//   this.location = trailData.location;
//   this.length = trailData.length;
//   this.stars = trailData.stars;
//   this.star_votes = trailData.star_votes;
//   this.summary = trailData.summary;
//   this.trail_url = trailData.trail_url;
//   this.conditions = trailData.conditions;
//   this.condition_date = trailData.condition_date;
//   this.condition_time = trailData.condition_time;
// }



// //=============================================//

// function handleGettingLocations(req, res) {
//   // get the data from the database ...
//   client.query('SELECT * FROM Locations;').then(data => {
//     res.send(data.rows);
//   }).catch(err => {
//     res.send('sorry .. an error occured ...', err);
//   });
// }

// function handleAddingLocations(req, res) {
//   const city = request.query.city;
//   location = new Location(city, locationData.body[0]);
//   let selecCity = 'SELECT * FROM location WHERE search_query = $1;';
//   let cityVal = [city];
//   client.query(selecCity, cityVal).then(result => {

//     response.status(200).json(result.rows);
//   });
//   let newLocation = 'INSERT INTO Locations(search_query,formatted_query,latitude,longitude) values ($1,$2,$3,$4) RETURNING *;';
//   const ValuesInsert = [city, location.formatted_query, location.latitude, location.longitude];

//   client.query(newLocation, ValuesInsert).then(DataX => {
//     response.status(200).json(DataX);
//   }).catch(() => {
//     response.status(500).send('Something Went Wrong');
//   });
// }


// function handleWrongPaths(req, res) {
//   res.status(404).send('page not found');
// }

// // function main() {
// //   return 'Hello, World!';
// // }

// // main();
// //==============================================//
// client.connect().then(() => {
//   app.listen(PORT, () => {
//     console.log(`You Successfully Connected To Port ${PORT} `);
//   });
// }).catch(err => {
//   console.log('Sorry ... and error occured ..', err);
// });


////////////////////////////////////////////////////




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

// ***************************************************** Location Handler **********************
app.get('/location', (request, response) => {
  const city = request.query.city;
  const SQL = 'SELECT * FROM locations WHERE search_query = $1';
  const value = [city];
  client
    .query(SQL, value)
    .then((result) => {
      if (result.rows.length > 0) {
        response.status(200).json(result.rows[0]);
        console.log('hi');
      } else {
        superagent(
          `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
        ).then((res) => {
          console.log('helloooo');
          const geoData = res.body;
          const locationData = new Location(city, geoData);
          const SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4) RETURNING *';
          const value = [
            locationData.search_query,
            locationData.formatted_query,
            locationData.latitude,
            locationData.longitude
          ];
          client.query(SQL, value).then((result) => {
            console.log(result.rows);
            response.status(200).json(result.rows[0]);
          });
        });
      }
    })
    .catch((err) => errorHandler(err, request, response)
    );
});

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// ***************************************************** Weather Handler **********************************

app.get('/weather', (request, response) => {
  const city = request.query.search_query;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.WEATHER_API_KEY}`;
  superagent(url)
    .then((res) => {
      const weatherNow = res.body.data.map((weatherData) => {
        return new Weather(weatherData);
      });
      response.status(200).json(weatherNow);
    })
    .catch((error) => errorHandler(error, request, response));
});

function Weather(weatherData) {
  this.forecast = weatherData.weather.description;
  this.datetime = new Date(weatherData.valid_date).toString().slice(4, 15);
}

// ***************************************************** Trails Handler *****************************************************************

app.get('/trails', (request, response) => {

  let url = `https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxResult=10&key=${process.env.TRAIL_API_KEY}`;

  superagent(url)
    .then((res) => {
      const trialData = res.body.trails.map((ourTrail) => {
        return new Trail(ourTrail);
      });
      response.status(200).json(trialData);
    })
    .catch((error) => errorHandler(error, request, response));
});

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.condition_time = trail.conditionDate.slice(0, 9);
  this.condition_date = trail.conditionDate.slice(11, 8);
}

// ***************************************************** Error Handler ******************************************\\
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Make sure the server is listeniing for requests
client.connect().then(() => {
  app.listen(PORT, () => { console.log(`PORT ${PORT}`); });
}).catch((err) => { throw new Error(err); });


