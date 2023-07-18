const express = require("express");
const router = express.Router();
const webController = require("../../controller/webController");

/** Put menu status for restaurant_id > :branch_id */
router.put("/:restaurant_id/:branch_id/", webController.putMenuStatus);

/** Delete menu or category for restaurant_id > branch_id */
router.delete("/:restaurant_id/:branch_id/:request_type/:request_id", webController.deleteMenuCategory);


module.exports = router;