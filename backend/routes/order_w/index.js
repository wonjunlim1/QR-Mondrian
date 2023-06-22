const express = require("express");
const router = express.Router();
const webOrderController = require("../../controller/webOrderController");

/** Get all menu for restaurant_id > :branch_id */
router.get("/:restaurant_id/:branch_id/", webOrderController.getAllOrders);

/** Put order status for restaurant_id > :branch_id */
router.put("/:restaurant_id/:branch_id/", webOrderController.putOrderStatus);

module.exports = router;