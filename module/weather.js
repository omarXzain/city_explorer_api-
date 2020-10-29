/* eslint-disable indent */
/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
const superagent = require('superagent');


function weatherHandler(request, response) {
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
}

function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.datetime = weatherData.valid_date;
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}

module.exports = weatherHandler;
