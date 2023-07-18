const express = require("express");
const router = express.Router();
const webController = require("../../controller/webController");

/** Put menu status for restaurant_id > branch_id */
router.put("/:restaurant_id/:branch_id/", webController.putMenuStatus);

/** Delete menu or category for restaurant_id > branch_id */
router.delete("/:restaurant_id/:branch_id/:request_type/:request_id", webController.deleteMenuCategory);

/** Post new menu category for restaurant_id > branch_id */
router.post("/:restaurant_id/:branch_id/edit", webController.createMenuCategory);

/** Put menu & menu category display orders for restaurant_id > branch_id */
router.put("/:restaurant_id/:branch_id/edit", webController.putDisplayOrder);

module.exports = router;