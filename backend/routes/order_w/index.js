const express = require('express');
const router = express.Router();
const webOrderController = require('../../controller/webOrderController')

/** Get all menu for restaurant_id > branch_id > :table_number */
router.get('/:restaurant_id/:branch_id/', webOrderController.getAllOrders)

module.exports = router;