const express = require('express');
const router = express.Router();
const mobileMenuController = require('../../controller/mobileMenuController')

/** Get all menu for restaurant_id > branch_id > :table_number */
router.get('/:restaurant_id/:branch_id/:table_number', mobileMenuController.getMobileMenu)

/** Get menu details for restaurant_id > branch_id > :table_number > :menu_id */
router.get('/:restaurant_id/:branch_id/:table_number/:menu_id', mobileMenuController.getMobileMenuDetail)

module.exports = router;