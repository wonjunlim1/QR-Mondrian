const {
  Restaurant,
  MainCategory,
  Branch,
  BranchMenuStatus,
  OrderItemOption,
  Order,
  OrderItem,
  SubOrder,
  MainMenu,
  OptionCategory,
  OptionMenu,
} = require("../models");
const sequelize = require("sequelize");

module.exports = {
  /* Get all menu */
  getWebOrders: async (restaurant_id, branch_id) => {
    try {
      const pastOrders = await Order.findAll({
        where: {
          restaurant_id: restaurant_id,
          branch_id: branch_id,
          order_status: 1,
        },
        include: {
          model: SubOrder,
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: MainMenu,
                },
                {
                  model: OrderItemOption,
                  include: [
                    {
                      model: OptionMenu,
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

      const orderMap = new Map();

      pastOrders.forEach((order) => {
        const tableNumber = order.table_number;
        const orderId = order.id;
        const key = `${tableNumber}-${orderId}`;

        if (!orderMap.has(key)) {
          orderMap.set(key, {
            order_id: orderId,
            table_number: tableNumber,
            sub_orders: [],
          });
        }

        const orderData = orderMap.get(key);

        order.SubOrders.forEach((subOrder) => {
          const mainMenus = subOrder.OrderItems.map((item) => {
            const optionMenus = item.OrderItemOptions.map((option) => {
              return {
                name: option.OptionMenu.name,
                price: option.OptionMenu.price,
              };
            });

            return {
              id: item.MainMenu.id,
              name: item.MainMenu.name,
              price: item.MainMenu.price,
              option_menus: optionMenus,
            };
          });

          orderData.sub_orders.push({
            sub_order_id: subOrder.id,
            order_status: subOrder.order_status,
            main_menus: mainMenus,
          });
        });
      });

      const acceptedOrders = [];
      const pendingOrders = [];

      orderMap.forEach((orderData, key) => {
        orderData.sub_orders.forEach((subOrder) => {
          const orderStatus = subOrder.order_status;

          if (orderStatus === "Accepted") {
            const existingAcceptedOrder = acceptedOrders.find(
              (order) =>
                order.table_number === orderData.table_number &&
                order.order_id === orderData.order_id
            );
            if (existingAcceptedOrder) {
              existingAcceptedOrder.sub_orders.push(subOrder);
            } else {
              acceptedOrders.push({
                table_number: orderData.table_number,
                order_id: orderData.order_id,
                sub_orders: [subOrder],
              });
            }
          } else if (orderStatus === "Pending") {
            const existingPendingOrder = pendingOrders.find(
              (order) =>
                order.table_number === orderData.table_number &&
                order.order_id === orderData.order_id
            );
            if (existingPendingOrder) {
              existingPendingOrder.sub_orders.push(subOrder);
            } else {
              pendingOrders.push({
                table_number: orderData.table_number,
                order_id: orderData.order_id,
                sub_orders: [subOrder],
              });
            }
          }
        });
      });

      return { Accepted: acceptedOrders, Pending: pendingOrders };
    } catch (error) {
      throw error;
    }
  },
  /* Put order status */
  putWebOrderStatus: async (currentRequest) => {
    const { close_order, update_sub_order } = currentRequest;
    let orderType;
    let orderId;

    if (close_order) {
      orderType = "order";
      orderId = close_order[0].order_id;
      try {
        await Order.update(
          { order_status: 0, updated_at: new Date() },
          { where: { id: orderId } }
        );
      } catch (error) {
        console.error(error);
      }
    } else if (update_sub_order) {
      orderType = "sub-order";
      orderId = update_sub_order[0].sub_order_id;
      orderStatus = update_sub_order[0].order_status;
      try {
        await SubOrder.update(
          { order_status: orderStatus, updated_at: new Date() },
          { where: { id: orderId } }
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Invalid request");
    }
    return [orderType, orderId];
  },
};