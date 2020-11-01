/* eslint-disable no-undef */
'use strict';

require('dotenv').config();
const superagent = require('superagent');

function moviesHandler(request, response) {
  const filmSearch = request.query.search_query;
  let movies_key = process.env.MOVIES_API_KEY;

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${movies_key}&query=${filmSearch}`;

  superagent.get(url)
    .then((dataX) => {
      const moviesNow = dataX.body.results;
      const filmData = moviesNow.map((moviesData) => {
        const moviesObject = new Movies(moviesData);
        return moviesObject;
      });
      response.send(filmData);
    })
    .catch((error) => errorHandler(error, request, response));
}

function Movies(moviesData) {
  this.title = moviesData.title;
  this.overview = moviesData.overview;
  this.average_votes = moviesData.average_votes;
  this.image_url = `https://image.tmdb.org/t/p/w500${moviesData.poster_path}`;
  this.popularity = moviesData.popularity;
  this.released_on = moviesData.released_on;
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = moviesHandler;
