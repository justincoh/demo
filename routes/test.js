var helpers = require('./helpers.js');
var request = require('request');

console.log(helpers)


var end = new Date(Date.now());
var start = new Date(Date.now() - 600000); //600000 ms in 10 minutes

var endString = end.toISOString();
var startString = start.toISOString();

// console.log(startString,endString)


var testUrl = helpers.getDataByMinute(startString, endString)

var options = {
    rejectUnauthorized: false, //interesting, find out why
    method: 'GET',
    // url: 'https://api.enertiv.com:443/api/location/8639f0e6-1623-4e60-8164-a853fb807917/data/?fromTime=2015-03-31T02%3A17%3A54.745Z&toTime=2015-03-31T02%3A47%3A54.745Z&interval=min&reading_type=3',
    url: testUrl,
    headers: {
        'Authorization': helpers.authKey
    }
};

request(options, function(err, response) {
    console.log('ERR ', err, '\n')

    var res = JSON.parse(response.body);
    console.log("RESPONSE ", res)
})



//Theirs
// https://api.enertiv.com:443/api/location/8639f0e6-1623-4e60-8164-a853fb807917/data/?fromTime=2015-03-30T20%3A47%3A34.181Z&toTime=2015-03-31T20%3A47%3A34.181Z&interval=min&aggregate=true&reading_type=3&cost=true





//Mine
// https://api.enertiv.com:443/api/location/8639f0e6-1623-4e60-8164-a853fb807917/data/?fromTime=2015-03-30T20%47%34.181Z&toTime=2015-03-31T20%47%34.181Z&interval=min&aggregate=true&reading_type=3&cost=true