const { Restaurant, Branch, BranchMenuStatus, MainCategory, MainMenu, OptionCategory, OptionMenu} = require('../models');
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
                    {
                      model: OptionCategory,
                      include: [
                        {
                          model: OptionMenu,
                        },
                      ],
                    },
                  ],
                },
              ],
            });
        
            const formattedMenu = mainCategories.map((mainCategory) => {
              return {
                category_name: mainCategory.name,
                main_menus: mainCategory.MainMenus.map((mainMenu) => {
                  return {
                    id: mainMenu.id,
                    name: mainMenu.name,
                    price: mainMenu.price,
                    description: mainMenu.description,
                    image_url: mainMenu.image_url,
                    option_categories: mainMenu.OptionCategories.map((optionCategory) => {
                      return {
                        option_category_name: optionCategory.name,
                        option_menus: optionCategory.OptionMenus.map((optionMenu) => {
                          return {
                            id: optionMenu.id,
                            name: optionMenu.name,
                            price: optionMenu.price,
                            description: optionMenu.description,
                          };
                        }),
                      };
                    }),
                  };
                }),
              };
            });
        
            return { menu: formattedMenu };
        } catch (error) {
            throw error;
        }
    
    }
}