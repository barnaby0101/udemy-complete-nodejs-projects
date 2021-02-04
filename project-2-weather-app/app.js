"use strict";

const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const location = process.argv[2];

geocode(location, (error, data = {}) => {     // ES6 destructuring
    if (!data.location) { return console.log("Please specify a location.")}
    if (error) {
        return console.log(error);
    }
    forecast(data.latitude, data.longitude, (error, forecastData) => {   // Berlin latitude: 52.5200 longitude: 13.4050
        if (error) {
            return console.log(error);
        }
        console.log(data.location);
        console.log(forecastData);
    })
});