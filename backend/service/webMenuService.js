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
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const s3 = require("../modules/s3-delete");
const CONFIG = require("../config/s3");

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

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
        // Look up rows in MainMenu table with mainCategoryId to use for deleting table
        const mainMenurows = await MainMenu.findAll({
          where: {
            main_category_id: request_id
          },
        })
        // Accessing the id column for each menu item
        const menuIds = mainMenurows.map((menuItem) => menuItem.id);
        // Delete image from S3 bucket
        for (const menuId of menuIds) {
          const filename = `${restaurant_id}/${menuId}.PNG`;
          s3.deleteFileFromS3(filename)
        }
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
        // Delete image from S3 bucket
        const filename = `${restaurant_id}/${request_id}.PNG`;
        console.log(filename)
        s3.deleteFileFromS3(filename)
        return affectedRows
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    } else {
      console.log("Invalid delete request.");
    }
  },
  createMenuCategory: async (restaurant_id, branch_id, new_category) => {
    try {
      // Add to MainCategory table
      const category = await MainCategory.create({
        restaurant_id: restaurant_id,
        name: new_category.create_menu_category.category_name,
        display_order: new_category.create_menu_category.display_order,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return category.id;
    } catch (error) { }
  },
  putDisplayOrder: async (restaurant_id, branch_id, curr_request) => {
    const category_update = curr_request.category_edit;
    const menu_update = curr_request.menu_edit;
    const updated_menu_category_id = [];
    const updated_menu_id = [];

    if (category_update) {
      for (let i = 0; i < category_update.length; i++) {
        const affectedRows = await MainCategory.update(
          {
            display_order: category_update[i].display_order,
            updated_at: new Date(),
          },
          {
            where: {
              id: category_update[i].id,
            },
          },
          updated_menu_category_id.push(category_update[i].id)
        );
      }
    }
    if (menu_update) {
      for (let i = 0; i < menu_update.length; i++) {
        const affectedRows = await MainMenu.update(
          {
            display_order: menu_update[i].display_order,
            updated_at: new Date(),
          },
          {
            where: {
              id: menu_update[i].id,
            },
          },
          updated_menu_id.push(menu_update[i].id)
        );
      }
    }
    return [updated_menu_category_id, updated_menu_id];
  },

  createMenu: async (restaurant_id, branch_id, imageUrl, menuData) => {
    let transaction;

    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      // Parse option_categories JSON data (in array)
      const optionCategories = JSON.parse(menuData.option_categories);

      // Get max Main menu Id
      const getMaxMainMenuId = await MainMenu.findOne({
        attributes: [[Sequelize.fn("MAX", Sequelize.col("id")), "maxId"]],
        raw: true,
      });
      // Step 1: Find MainCategory
      const mainCategory = await MainCategory.findOne({
        where: {
          restaurant_id: restaurant_id,
          name: menuData.category,
        },
        transaction,
      });

      // Step 2: Add to MainMenu table
      const menu = await MainMenu.create(
        {
          id: getMaxMainMenuId.maxId + 1,
          main_category_id: mainCategory.id,
          name: menuData.name,
          price: menuData.price,
          description: menuData.description,
          image_url: imageUrl,
          display_order: menuData.display_order,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction }
      );

      // Step 3: Add to OptionCategory and OptionMenu tables
      for (const optionCategoryData of optionCategories) {
        const optionCategory = await OptionCategory.create(
          {
            main_menu_id: menu.id,
            name: optionCategoryData.option_category_name,
            display_order: optionCategoryData.display_order,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction }
        );

        for (const optionMenuData of optionCategoryData.option_menus) {
          await OptionMenu.create(
            {
              option_category_id: optionCategory.id,
              name: optionMenuData.name,
              price: optionMenuData.price,
              description: optionMenuData.description,
              display_order: optionMenuData.display_order,
              created_at: new Date(),
              updated_at: new Date(),
            },
            { transaction }
          );
        }
      }

      // Step 4: Add the associations of macin category <> main menu
      await mainCategory.addMainMenu(menu, { transaction });

      // Step 5: Add data to BranchMenuStatus table
      const branch_ids = await Branch.findAll({
        where: {
          restaurant_id: restaurant_id,
        },
        transaction,
      });

      for (let branch of branch_ids) {
        const branchMenuStatus = await BranchMenuStatus.create(
          {
            branch_id: branch.id,
            main_menu_id: menu.id,
            active: true,
            updated_at: new Date(),
          },
          { transaction }
        );
      }

      // Commit the transaction
      await transaction.commit();

      // Return the created menu id
      return menu.id;
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) await transaction.rollback();
      console.error("Error while creating menu:", error);
      throw error;
    }
  },

  updateMenu: async (restaurant_id, branch_id, menu_id, imageUrl, menuData) => {
    let transaction;

    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      // Parse option_categories JSON data
      const optionCategories = JSON.parse(menuData.option_categories);

      // Step 1: Lookup the main menu by menu_id
      const mainMenu = await MainMenu.findByPk(menu_id, { transaction });
      if (!mainMenu) {
        throw new Error(`Menu with id ${menu_id} not found`);
      }
      // Step 1: Find MainCategory
      const mainCategory = await MainCategory.findOne({
        where: {
          restaurant_id: restaurant_id,
          name: menuData.category,
        },
        transaction,
      });

      if (menuData.image_deleted == "false") {
        imageUrl =
          CONFIG.aws_url + `${restaurant_id}/${menu_id}.PNG`;
      } else {
        // If image is empty, delete from S3
        const filename = `${restaurant_id}/${menu_id}.PNG`;
        s3.deleteFileFromS3(filename)
      }

      // Step 2: Update the MainMenu table
      await MainMenu.update(
        {
          name: menuData.name,
          price: menuData.price,
          main_category_id: mainCategory.id,
          description: menuData.description,
          image_url: imageUrl,
          display_order: menuData.display_order,
          updated_at: new Date(),
        },
        { where: { id: menu_id }, transaction }
      );

      // Step 3: Delete all related OptionCategory and OptionMenu records for the menu
      await OptionCategory.destroy({
        where: { main_menu_id: menu_id },
        transaction,
      });

      // Step 4: Add to OptionCategory and OptionMenu tables
      for (const optionCategoryData of optionCategories) {
        const optionCategory = await OptionCategory.create(
          {
            main_menu_id: menu_id,
            name: optionCategoryData.option_category_name,
            display_order: optionCategoryData.display_order,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction }
        );

        for (const optionMenuData of optionCategoryData.option_menus) {
          await OptionMenu.create(
            {
              option_category_id: optionCategory.id,
              name: optionMenuData.name,
              price: optionMenuData.price,
              description: optionMenuData.description,
              display_order: optionMenuData.display_order,
              created_at: new Date(),
              updated_at: new Date(),
            },
            { transaction }
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      // Return the updated menu id
      return menu_id;
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) await transaction.rollback();
      console.error("Error while updating menu:", error);
      throw error;
    }
  },
};