/* eslint-disable no-undef */
"use strict";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const superagent = require("superagent");
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());

const locationHandler = require("./module/location.js");
const weatherHandler = require("./module/weather.js");
const trailsHandler = require("./module/trails.js");
const moviesHandler = require("./module/movies.js");
const yelpHandler = require("./module/yelp.js");

app.get("/location", locationHandler);
app.get("/weather", weatherHandler);
app.get("/trails", trailsHandler);
app.get("/movies", moviesHandler);
app.get("/yelp", yelpHandler);

app.use("*", notFoundHandler);
app.use(errorHandler);

// ###################### Error Handler ########################
function notFoundHandler(req, res) {
  res.status(404).send("Page Not Found!!");
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Make sure the server is listening
client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`You Successfully Connected To Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Sorry ... and error occured ..", err);
  });

// #############################################################
