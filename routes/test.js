var helpers = require('./helpers.js');
var request = require('request');

console.log(helpers)


var end = new Date(Date.now());
var start = new Date(Date.now() - 600000); //600000 ms in 10 minutes

var endString = end.toISOString();
var startString = start.toISOString();


var testUrl = helpers.getDataByMinute(startString, endString)

var options = {
    rejectUnauthorized: false, //interesting, find out why
    method: 'GET',
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