const sequelize = require("sequelize");
const mobileCartService = require("../service/mobileCartService");
const ut = require("../modules/util");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

module.exports = {
  /* GET: [ /:restaurant_id/:branch_id/:table_number/] */
  getPastOrder: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const table_number = req.params.table_number;
    try {
      const mobileCart = await mobileCartService.getPastOrder(
        restaurant_id,
        branch_id,
        table_number
      );
      if (mobileCart.past_orders.length === 0) {
        return res
          .status(sc.OK)
          .send(
            ut.success(
              sc.OK,
              "No past orders found for the provided restaurant_id, branch_id, and table_number.",
              mobileCart.past_orders
            )
          );
      }
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, "Get mobile Past Orders Success", mobileCart));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* POST: [ /:restaurant_id/:branch_id/:table_number/] */
  postCurrentOrder: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const table_number = req.params.table_number;
    const current_order = req.body;

    // Check if the current_order is empty or null
    if (!current_order || Object.keys(current_order).length === 0) {
      return res
        .status(sc.BAD_REQUEST)
        .send(ut.fail(sc.BAD_REQUEST, "No order data provided."));
    }

    try {
      const newOrderId = await mobileCartService.postCurrentOrder(
        restaurant_id,
        branch_id,
        table_number,
        current_order
      );
      return res
        .status(sc.OK)
        .send(
          ut.success(sc.OK, `Order successfully created/updated with new/updated order_id:${newOrderId}`)
        );
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },
};