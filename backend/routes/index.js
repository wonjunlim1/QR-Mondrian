var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/** Menu view for mobile & web */
router.use('/menu', require('./menu'))

/** Cart view for mobile */
router.use('/cart_m', require('./cart_m'))

/** Order view for web */
router.use('/order_w', require('./order_w'))

/** Menu view for web */
router.use('/menu_w', require('./menu_w'))


module.exports = router;