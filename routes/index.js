var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sieu Nhan Bien Hinh' });
});

// ajax show sender message
router.get('/show-sender-message', function(req, res, next) {
  var dir = req.query.dir;
  var msg = req.query.msg;
  var name = req.query.name;
  res.render('components/chat', { dir: dir, msg: msg, name: name });
});


module.exports = router;
