var authKey = require('./helpers.js').authKey;
var request = require('request');

console.log(authKey);

//Need to set up the URL to take different times

var options = {
    rejectUnauthorized: false, //interesting, find out why
    method: 'GET',
    url: 'https://api.enertiv.com:443/api/location/8639f0e6-1623-4e60-8164-a853fb807917/data/?fromTime=2015-03-31T02%3A17%3A54.745Z&toTime=2015-03-31T02%3A47%3A54.745Z&interval=min&reading_type=3',
    headers: {
        'Authorization': authKey
    }
};

request(options, function(err, response, body) {
    console.log('ARGS ', err, response.body, '\n',more)
})