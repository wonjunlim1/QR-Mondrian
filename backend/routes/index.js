var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/** Get menu for mobile view*/
router.use('/menu_m', require('./menu_m'))


module.exports = router;
