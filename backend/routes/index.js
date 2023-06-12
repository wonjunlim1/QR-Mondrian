var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/** Menu view for mobile */
router.use('/menu_m', require('./menu_m'))

/** Cart view for mobile */
router.use('/cart_m', require('./cart_m'))

module.exports = router;