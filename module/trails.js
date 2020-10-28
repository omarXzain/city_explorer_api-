/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-undef */
"use strict";

require("dotenv").config();
const superagent = require("superagent");

function handleTrails(req, res) {
  let trailsKey = process.env.TRAIL_API_KEY;
  superagent
    .get(
      `https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${trailsKey}`
    )
    .then((data) => {
      const trailsData = data.body.trails;
      res.send(trailsData);
      trailsData.map((constValue) => {
        return new Trails(constValue);
      });
    })
    .catch((error) => errorHandler(error, req, res));
}
//%%%%%%%%%%%%%%%%%%%%%% Trails Function %%%%%%%%%%%%%%%%%%%%%%%
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

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = handleTrails;
