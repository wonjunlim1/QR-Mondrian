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
const Op = sequelize.Op;

module.exports = {
  /* Update menu status */
  putMenuStatus: async (restaurant_id, branch_id, curr_request) => {
    const { menu_status_change } = curr_request;
    const { menu_id, status } = menu_status_change;
    const branchId = branch_id;
    try {
      const affectedRows = await BranchMenuStatus.update(
        { active: status, updated_at: new Date() },
        {
          where: {
            main_menu_id: menu_id,
            branch_id: branchId,
          },
          include: {
            model: Branch,
            where: {
              id: branch_id,
              restaurant_id: restaurant_id,
            },
          },
        }
      );
      return affectedRows;
    } catch (error) { }
  },
  deleteMenuCategory: async (
    restaurant_id,
    branch_id,
    request_type,
    request_id
  ) => {
    // If the request is for menu category
    if (request_type == 1) {
      try {
        const affectedRows = await MainCategory.destroy({
          where: {
            id: request_id,
          },
        });
      } catch (error) {
        console.error("Error deleting menu category:", error);
      }
    } else if (request_type == 0) {
      // If the request is for menu
      try {
        const affectedRows = await MainMenu.destroy({
          where: {
            id: request_id,
          },
        });
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    } else {
      console.log("Invalid delete request.");
    }
  },
  createMenuCategory: async (
    restaurant_id,
    branch_id,
    new_category) => {
    try {
      // Add to MainCategory table
      const category = await MainCategory.create({
        restaurant_id: restaurant_id,
        name: new_category.create_menu_category.category_name,
        display_order: new_category.create_menu_category.display_order,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return category.id
    } catch (error) { }
  }
};