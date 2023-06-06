const express = require('express');
const router = express.Router();
const mobileMenuController = require('../../controller/mobileMenuController')

/** Get all menu for restaurant_id > branch_id > :table_number*/
router.get('/:restaurant_id/:branch_id/:table_number', mobileMenuController.getMobileMenu)

module.exports = router;
