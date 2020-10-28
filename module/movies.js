/* eslint-disable no-undef */
"use strict";

require("dotenv").config();
const superagent = require("superagent");

function moviesHandler(request, response) {
  const filmSearch = request.query.search_query;
  let movies_key = process.env.MOVIES_API_KEY;

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${movies_key}&query=${filmSearch}`;

  superagent(url)
    .then((dataX) => {
      const moviesNow = dataX.body.data.map((moviesData) => {
        return new Movies(moviesData);
      });
      // response.status(200).json(moviesNow);
      return moviesNow;
    })
    .catch((error) => errorHandler(error, request, response));
}

function Movies(moviesData) {
  this.title = moviesData.title;
  this.overview = moviesData.overview;
  this.average_votes = moviesData.average_votes;
  this.image_url = moviesData.image_url;
  this.popularity = moviesData.popularity;
  this.released_on = moviesData.released_on;
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = moviesHandler;
