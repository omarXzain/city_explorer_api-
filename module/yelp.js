/* eslint-disable no-undef */
"use strict";

require("dotenv").config();
const superagent = require("superagent");
let yelp_key = process.env.YELP_API_KEY;

function yelpHandler(request, response) {
  const city = request.query.search_query;
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
  superagent(url)
    .set('Authorization', `Bearer ${yelp_key}`)
    .then((dataX) => {
      const yelpNow = dataX.body.businesses.map((yelpData) => {
        return new Yelp(yelpData);
      });
      // response.status(200).json(yelpNow);
      return yelpNow;
    })
    .catch((error) => errorHandler(error, request, response));
}

function Yelp(yelpData) {
  this.name = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = yelpHandler;
