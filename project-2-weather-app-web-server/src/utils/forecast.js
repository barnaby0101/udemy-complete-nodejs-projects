const request = require("request");
const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY;

const forecast = (latitude, longitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=" + WEATHERSTACK_API_KEY + "&units=f&query="
        + encodeURIComponent(latitude) + "," + encodeURIComponent(longitude);
    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback("Unable to connect to weather service.", null);
        } else if (body.success === false) {
            callback("Unable to find location.", null);
        } else {
            const rawTime = body.location.localtime;
            const time = rawTime.match(/\d\d:\d\d/)[0];
            amPm = (time.match(/\d\d(?=:)/)[0] < 12) ? "am" : "pm";
            callback(null, 
                "The weather is " + body.current.weather_descriptions[0].toLowerCase() + ". " +
                "It is currently " + body.current.temperature +
                " degrees F, and it feels like " + body.current.feelslike + " degrees F." +
                " Local time is " + time + " " + amPm + "."
            )
        }
    })
}

module.exports = forecast;