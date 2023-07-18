const express = require("express");
const router = express.Router();
const webController = require("../../controller/webController");

/** Get all menu for restaurant_id > :branch_id */
router.get("/:restaurant_id/:branch_id/", webController.getAllOrders);

/** Put order status for restaurant_id > :branch_id */
router.put("/:restaurant_id/:branch_id/", webController.putOrderStatus);

module.exports = router;