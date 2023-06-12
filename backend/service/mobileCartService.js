const {
  Restaurant,
  MainCategory,
  OrderItemOption,
  Order,
  OrderItem,
  SubOrder,
  MainMenu,
  OptionCategory,
  OptionMenu,
} = require("../models");
const sequelize = require("sequelize");
const restaurants = require("../models/restaurants");
const Op = sequelize.Op;

module.exports = {
  /* Get past orders */
  getPastOrder: async (restaurant_id, branch_id, table_number) => {
    try {
      const pastOrders = await Order.findAll({
        where: {
          restaurant_id: restaurant_id,
          branch_id: branch_id,
          table_number: table_number,
          order_status: 1, // 'active' = 1 indicates that the suborder/past order exists
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

      const mappedOrders = pastOrders.map((order) => {
        const subOrders = order.SubOrders.map((subOrder) => {
          return {
            sub_order_id: subOrder.id,
            order_status: subOrder.order_status,
            main_menus: subOrder.OrderItems.map((item) => {
              const optionMenus = item.OrderItemOptions.map((option) => {
                return {
                  name: option.OptionMenu.name,
                  price: option.OptionMenu.price,
                };
              });

              return {
                name: item.MainMenu.name,
                price: item.MainMenu.price,
                option_menus: optionMenus,
              };
            }),
          };
        });

        return subOrders;
      });

      return { past_orders: mappedOrders };
    } catch (error) {
      throw error;
    }
  },
  /* Post current order */
  postCurrentOrder: async (
    restaurant_id,
    branch_id,
    table_number,
    current_order
  ) => {
    const curr_order = current_order.current_order;
    let status = 1;

    // Calculate the sum of the current_order
    let currentOrderPrice = 0;
    if (curr_order && Array.isArray(curr_order)) {
      for (const item of curr_order) {
        if (item.main_menus && Array.isArray(item.main_menus)) {
          for (const menu of item.main_menus) {
            currentOrderPrice += menu.price;

            if (menu.option_menus && Array.isArray(menu.option_menus)) {
              for (const optionMenu of menu.option_menus) {
                currentOrderPrice += optionMenu.price;
              }
            }
          }
        }
      }
    }

    const pastOrders = await Order.findAll({
      where: {
        restaurant_id,
        branch_id,
        table_number,
      },
      order: [["created_at", "DESC"]],
      limit: 1,
    });
    // console.log(status)
    // return {'status' : status};
  },
};
