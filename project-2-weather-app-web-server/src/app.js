const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();
const port = process.env.PORT || 3000;      // use val passed by Heroku, or 3000 

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public"); // use the specified directory as the project root
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set up Handlebars engine and views location in Express
app.set("view engine", "hbs");  // handlebars node plugin
app.set("views", viewsPath)     // change handlebars template dir from default "views"
hbs.registerPartials(partialsPath);     // set handlebars directory for re-used page sections

app.use(express.static(publicDirectoryPath)); // configure Express static directory to serve

app.get("", (req, res) => {     // set index.hbs as index, set up variables to pass
    res.render("index.hbs", {
        title: "Weather Service",
        name: "Barnaby Thieme"
    }); 
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
        name: "Barnaby Thieme"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        geoApi: "Geocoding",
        weatherApi: "Weatherstack",
        name: "Barnaby Thieme"
    })
})

// set up URI query parsing for `weather` endpoint with 
// chained calls to mapbox and weatherstack as defined
// in geocode.js and forecast.js in utils dir. 

app.get("/weather", (req, res) => {   
    if (!req.query.address) {
        res.send({
            error: "You must provide an address."
        })
    } else {
        geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {  // baseURL + ?address=!address
            if (error) { return res.send({ error }) };
            forecast(latitude, longitude, (error, forecastData) => { // pass address coordinates to weatherstack API, return JSON
                if (error) { res.send({ error }) }
                else {
                    res.send({
                        location,
                        forecast: forecastData,
                        address: req.query.address
                    })
                }
            })
        });
    }
});

app.get("/help/*", (req, res) => {      // 404 in /help path
    res.render("404", {
        title: "404",
        name: "Barnaby Thieme",
        pageType: "help article"
    })
})

app.get("*", (req, res) => {            // all other 404s. Note: must be last
    res.render("404", {                 // as Express executes first match
        title: "404",
        name: "Barnaby Thieme",
        pageType: "page"
    })
})

app.listen(port, () => {
    console.log("Server started on port " + port + ".");
});