const { Restaurant, Branch, BranchMenuStatus, MainCategory, MainMenu, OptionCategory, OptionMenu } = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
  /* Get all menu */
  getAllMobileMenu: async (restaurant_id, branch_id, table_number) => {
    try {
      const mainCategories = await MainCategory.findAll({
        where: { restaurant_id: restaurant_id },
        include: [
          {
            model: MainMenu,
            include: [
              {
                model: BranchMenuStatus,
                where: { branch_id: branch_id },
              },
            ],
          },
        ],
      });



      const formattedMenu = mainCategories.map((mainCategory) => {
        return {
          category_name: mainCategory.name,
          display_order: mainCategory.display_order,
          main_menus: mainCategory.MainMenus.map((mainMenu) => {
            return {
              id: mainMenu.id,
              name: mainMenu.name,
              price: mainMenu.price,
              description: mainMenu.description,
              image_url: mainMenu.image_url,
              display_order: mainMenu.display_order,
              menu_status: mainMenu.BranchMenuStatuses[0].active
            };
          }),
        };
      });
      // Sort by display_order
      for (let i = 0; i < formattedMenu.length; i++) {
        const category = formattedMenu[i];
        const mainMenus = category.main_menus;
        // Sort main_menus array by display_order
        for (let j = 0; j < mainMenus.length; j++) {
          mainMenus.sort((a, b) => a.display_order - b.display_order);
        }
      }
      formattedMenu.sort((a, b) => a.display_order - b.display_order);

      return { menu: formattedMenu };
    } catch (error) {
      throw error;
    }

  },

  /* Get Detail Mobile Menu */
  getMobileMenuDetail: async (restaurant_id, branch_id, table_number, menu_id) => {
    try {
      const menu = await MainMenu.findOne({
        where: { id: menu_id },
        include: [
          {
            model: MainCategory,
            where: { restaurant_id: restaurant_id },
          },
          {
            model: BranchMenuStatus,
            where: { branch_id: branch_id },
          },
          {
            model: OptionCategory,
            include: [
              {
                model: OptionMenu,
              },
            ],
          },
        ],
      });
      const formattedMenu = {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        description: menu.description,
        image_url: menu.image_url,
        option_categories: menu.OptionCategories.map((optionCategory) => {
          return {
            option_category_name: optionCategory.name,
            display_order: optionCategory.display_order,
            option_menus: optionCategory.OptionMenus.map((optionMenu) => {
              return {
                id: optionMenu.id,
                name: optionMenu.name,
                price: optionMenu.price,
                description: optionMenu.description,
                display_order: optionMenu.display_order,
              };
            }),
          };
        }),
      };

      // Sort by display_order
      for (let i = 0; i < formattedMenu.option_categories.length; i++) {
        const data = formattedMenu.option_categories[i];
        const optionMenus = data.option_menus;
        // Sort main_menus array by display_order
        for (let j = 0; j < optionMenus.length; j++) {
          optionMenus.sort((a, b) => a.display_order - b.display_order);
        }
      }
      formattedMenu.option_categories.sort((a, b) => a.display_order - b.display_order);
      return { 'menu_details': formattedMenu }

    } catch (error) {
      throw error;
    }

  },
}