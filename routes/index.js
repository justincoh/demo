var express = require('express');
var router = express.Router();
var helpers = require('./helpers.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/?',function(req,res){

	console.log('QUERY ROUTE HIT ',req.query)

	res.status(200).send();
})


module.exports = router;
