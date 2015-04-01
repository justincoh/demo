var express = require('express');
var router = express.Router();
var helpers = require('./helpers.js');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/data?', function(req, res) {
	console.log("QUERY ROUTE HIT ",req.query)
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    var requestUrl = helpers.getDataByMinute(startTime, endTime)

    var requestOptions = {
        rejectUnauthorized: false, //interesting, find out why
        method: 'GET',
        url: requestUrl,
        headers: {
            'Authorization': helpers.authKey
        }
    };

    request(requestOptions,function(err,response){
    	if(err) {console.log('err',err); res.json(err)};
    	var enertivRes = JSON.parse(response.body);
    	res.json(enertivRes);
    })


})





module.exports = router;