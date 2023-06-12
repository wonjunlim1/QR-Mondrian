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

    let oderId;
    // Check if past orders exist or if the order is active
    if (pastOrders.length === 0) {
      console.log("S1: no past order, order successfully created");
      // Create a new order with order_status = 1 (active) and total_price = currentSum
      const order = await Order.create({
        restaurant_id: restaurant_id,
        branch_id: branch_id,
        table_number: table_number,
        total_price: currentOrderPrice,
        order_status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      orderId = order.id;

      // Create a new sub_order with order_status = 'pending' and partial_price = currentSum
      const subOrder = await SubOrder.create({
        order_id: orderId,
        partial_price: currentOrderPrice,
        order_status: "Pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Create order items and order item options
      for (const item of curr_order) {
        const { main_menus } = item;

        if (main_menus && Array.isArray(main_menus)) {
          for (const main_menu of main_menus) {
            const {
              id: main_menu_id,
              price: main_menu_price,
              option_menus,
            } = main_menu;
            const orderItem = await OrderItem.create({
              sub_order_id: subOrder.id,
              main_menu_id,
              main_menu_price,
            });

            if (option_menus && Array.isArray(option_menus)) {
              for (const option of option_menus) {
                const { id: option_menu_id, price: option_menu_price } = option;
                await OrderItemOption.create({
                  sub_order_item_id: orderItem.id,
                  option_menu_id,
                  option_menu_price,
                });
              }
            }
          }
        }
      }
      status = 1;
    } else if (pastOrders[0].order_status === false) {
      console.log("S2 no active order");
      // Create a new order with order_status = 1 (active) and total_price = currentSum
      const order = await Order.create({
        restaurant_id: restaurant_id,
        branch_id: branch_id,
        table_number: table_number,
        total_price: currentOrderPrice,
        order_status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      orderId = order.id;

      // Create a new sub_order with order_status = 'pending' and partial_price = currentSum
      const subOrder = await SubOrder.create({
        order_id: orderId,
        partial_price: currentOrderPrice,
        order_status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Create order items and order item options
      for (const item of curr_order) {
        const { main_menus } = item;

        if (main_menus && Array.isArray(main_menus)) {
          for (const main_menu of main_menus) {
            const {
              id: main_menu_id,
              price: main_menu_price,
              option_menus,
            } = main_menu;
            const orderItem = await OrderItem.create({
              sub_order_id: subOrder.id,
              main_menu_id,
              main_menu_price,
            });

            if (option_menus && Array.isArray(option_menus)) {
              for (const option of option_menus) {
                const { id: option_menu_id, price: option_menu_price } = option;
                await OrderItemOption.create({
                  sub_order_item_id: orderItem.id,
                  option_menu_id,
                  option_menu_price,
                });
              }
            }
          }
        }
      }
      status =
        "No active order, order successfully created with order id of ${orderId}";
    }
    // If past order exists, get the order ID of the past order
    else if (pastOrders[0].order_status === true) {
      console.log("S3 past order exists, get the id");
      orderId = pastOrders[0].id;
      sumPrice = pastOrders[0].total_price + currentOrderPrice;

      const updatedOrder = await Order.update(
        {
          total_price: sumPrice,
          updated_at: new Date(),
        },
        { where: { id: orderId } }
      );

      // Create a new sub_order with order_status = 'pending' and partial_price = currentSum
      const subOrder = await SubOrder.create({
        order_id: orderId,
        partial_price: currentOrderPrice,
        order_status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Create order items and order item options
      for (const item of curr_order) {
        const { main_menus } = item;

        if (main_menus && Array.isArray(main_menus)) {
          for (const main_menu of main_menus) {
            const {
              id: main_menu_id,
              price: main_menu_price,
              option_menus,
            } = main_menu;
            const orderItem = await OrderItem.create({
              sub_order_id: subOrder.id,
              main_menu_id,
              main_menu_price,
            });

            if (option_menus && Array.isArray(option_menus)) {
              for (const option of option_menus) {
                const { id: option_menu_id, price: option_menu_price } = option;
                await OrderItemOption.create({
                  sub_order_item_id: orderItem.id,
                  option_menu_id,
                  option_menu_price,
                });
              }
            }
          }
        }
      }
      status =
        "Active suborder found, order successfully updated to order id of ${orderId}";
    }
    // console.log(status)
    // return {'status' : status};
  },
};
