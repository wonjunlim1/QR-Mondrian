const express = require("express");
const router = express.Router();
const webController = require("../../controller/webController");
const upload = require('../../modules/multer');

/** Put menu status for restaurant_id > branch_id */
router.put("/:restaurant_id/:branch_id/status", webController.putMenuStatus);

/** Delete menu or category for restaurant_id > branch_id */
router.delete("/:restaurant_id/:branch_id/:request_type/:request_id", webController.deleteMenuCategory);

/** Post new menu category for restaurant_id > branch_id */
router.post("/:restaurant_id/:branch_id/category", webController.createMenuCategory);

/** Put menu & menu category display orders for restaurant_id > branch_id */
router.put("/:restaurant_id/:branch_id/display_order", webController.putDisplayOrder);

/** Post new menu with image for restaurant_id > branch_id > menu_id */
router.post("/:restaurant_id/:branch_id/menu", upload.single('image'), webController.createMenu)

/** Update menu with image for restaurant_id > branch_id > menu_id */
// router.put("/:restaurant_id/:branch_id/:menu_id/menu", upload.single('image'), webController.updateMenu)

module.exports = router;