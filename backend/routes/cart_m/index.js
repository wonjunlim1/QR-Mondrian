const express = require('express');
const router = express.Router();
const mobileCartController = require('../../controller/mobileCartController')

/** Get cart info for restaurant_id > branch_id > :table_number */
router.get('/:restaurant_id/:branch_id/:table_number', mobileCartController.getPastOrder)

/** Post cart info for restaurant_id > branch_id > :table_number */
router.post('/:restaurant_id/:branch_id/:table_number', mobileCartController.postCurrentOrder)

module.exports = router;
