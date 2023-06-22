const sequelize = require('sequelize');
const webOrderService = require('../service/webOrderService')
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');

module.exports = {

    /* GET: [ /:restaurant_id/:branch_id/:table_number/] */
    getAllOrders: async (req, res) => {
        const restaurant_id = req.params.restaurant_id
        const branch_id = req.params.branch_id
        try {
            const allOrders = await webOrderService.getWebOrders(restaurant_id, branch_id);
            if (!allOrders) {
                console.log('No orders currently open for the provided restaurant_id, branch_id.');
                return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "Get all orders for web Success", allOrders));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    }
}