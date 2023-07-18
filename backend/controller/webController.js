const sequelize = require("sequelize");
const webMenuService = require("../service/webMenuService");
const webOrderService = require("../service/webOrderService");
const ut = require("../modules/util");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

module.exports = {
  /* GET: [ /:restaurant_id/:branch_id/] */
  getAllOrders: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    try {
      const allOrders = await webOrderService.getWebOrders(
        restaurant_id,
        branch_id
      );
      if (!allOrders) {
        console.log(
          "No orders currently open for the provided restaurant_id, branch_id."
        );
        return res
          .status(sc.INTERNAL_SERVER_ERROR)
          .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
      }
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, "Get all orders for web Success", allOrders));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* PUT: [ order_w/:restaurant_id/:branch_id/] */
  putOrderStatus: async (req, res) => {
    try {
      const currentRequest = req.body;
      const [orderType, orderId] = await webOrderService.putWebOrderStatus(
        currentRequest
      );
      let message;
      if (orderType === "order") {
        message = `Order successfully closed for order id ${orderId}`;
      } else if (orderType === "sub-order") {
        message = `Sub-order successfully updated for sub-order id ${orderId}`;
      } else {
        message = "Invalid Request";
      }
      return res.status(sc.OK).send(ut.success(sc.OK, message));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* PUT: [ menu_w/:restaurant_id/:branch_id] */
  putMenuStatus: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const curr_request = req.body;

    try {
      const menu = await webMenuService.putMenuStatus(
        restaurant_id,
        branch_id,
        curr_request
      );
      const menu_id = curr_request.menu_status_change.menu_id
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu active status successfully updated for res_id: ${restaurant_id}, branch_id: ${branch_id}, and menu_id: ${menu_id}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  deleteMenuCategory: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const request_type = req.params.request_type;
    const request_id = req.params.request_id;
    try {
      const params = await webMenuService.deleteMenuCategory(
        restaurant_id,
        branch_id,
        request_type,
        request_id
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  createMenuCategory: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const newCategory = req.body
    try {
      const params = await webMenuService.createMenuCategory(
        restaurant_id,
        branch_id,
        newCategory
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu category successfully created: menu category id ${params}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  putDisplayOrder: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const newOrder = req.body
    try {
      const params = await webMenuService.putDisplayOrder(
        restaurant_id,
        branch_id,
        newOrder
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Display order successfully updated for category id: ${params[0]} and menu id: ${params[1]}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  }
};

