var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var checker = require('../lib/checker');


router.route('/search')
  .get(function(req, res, next) {
    var result = checker(req.query.search, res);
  });


module.exports = router;
