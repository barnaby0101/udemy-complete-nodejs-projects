const request = require("request");

const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiYmF0aGllbWUiLCJhIjoiY2tpaDgzMTYyMXV2czJycGVpbHZkZW9oYyJ9.GigpmekEvFW81B-kjzn3jg&limit=1";
    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback("Unable to connect to location service.", null);
        } else if (body.features.length === 0) {
            callback("Unable to find location.", null);
        } else {
            callback(null, {
                longitude: body.features[0].geometry.coordinates[0],
                latitude: body.features[0].geometry.coordinates[1], 
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;