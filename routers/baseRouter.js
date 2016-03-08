var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var options = {
    root: __dirname + '/../dist/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile('index.html', options);
});

module.exports = router;
