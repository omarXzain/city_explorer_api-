/* eslint-disable indent */
/* eslint-disable no-undef */
'use strict';

require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
    .then();


function locationHandler(request, response) {
    const city = request.query.city;
    const SQL = 'SELECT * FROM locations WHERE search_query = $1';
    const value = [city];
    client
        .query(SQL, value)
        .then((result) => {

            if (result.rows.length > 0) {
                response.status(200).json(result.rows[0]);
            } else {
                superagent(
                    `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
                ).then((dataX) => {
                    const geoData = dataX.body;
                    const locationData = new LocationConstructor(city, geoData);

                    const SQL2 = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1,$2,$3,$4) RETURNING *';

                    const value2 = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];

                    client.query(SQL2, value2)
                        .then((result) => {
                            response.status(200).json(result.rows[0]);
                        });
                });
            }
        }).catch((err) => errorHandler(err, request, response)
        );
}

function LocationConstructor(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}

module.exports = locationHandler;
