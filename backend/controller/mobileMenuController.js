const sequelize = require('sequelize');
const mobileMenuService = require('../service/mobileMenuService')
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');

module.exports = {

    /* GET: [ /:restaurant_id/:branch_id/:table_number/] */
    getMobileMenu: async (req, res) => {
        const restaurant_id = req.params.restaurant_id
        const branch_id = req.params.branch_id
        const table_number = req.params.table_number
        try {
            const mobileMenu = await mobileMenuService.getAllMobileMenu(restaurant_id, branch_id, table_number);
            if (!mobileMenu) {
                console.log('No menu');
                return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "Get mobile Menu Success", mobileMenu));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },
    /* GET: [ /:restaurant_id/:branch_id/:table_number/:menu_id] */
    getMobileMenuDetail: async (req, res) => {
        const restaurant_id = req.params.restaurant_id
        const branch_id = req.params.branch_id
        const table_number = req.params.table_number
        const menu_id = req.params.menu_id
        try {
            const mobileMenu = await mobileMenuService.getMobileMenuDetail(restaurant_id, branch_id, table_number, menu_id);
            if (!mobileMenu) {
                console.log('No menu');
                return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "Get detail mobile Menu Success", mobileMenu));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },
}

