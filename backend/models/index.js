const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
 sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
 sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/** Models */
db.Restaurant = require('./restaurants')(sequelize, Sequelize);
db.Branch = require('./branches')(sequelize, Sequelize);
db.MainCategory = require('./main_categories')(sequelize, Sequelize);
db.BranchMenuStatus = require('./branches_menu_status')(sequelize, Sequelize);
db.MainMenu = require('./main_menus')(sequelize, Sequelize);
db.OptionCategory = require('./option_categories')(sequelize, Sequelize);
db.OptionMenu = require('./option_menus')(sequelize, Sequelize);
db.Order = require('./orders')(sequelize, Sequelize);
db.SubOrder = require('./suborders')(sequelize, Sequelize);
db.OrderItem = require('./order_items')(sequelize, Sequelize);
db.OrderItemOption = require('./order_item_options')(sequelize, Sequelize);

/** Relations */

// Restaurant Model
db.Restaurant.hasMany(db.Branch, { foreignKey: 'restaurant_id' });
db.Branch.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id' });

db.Restaurant.hasMany(db.MainCategory, { foreignKey: 'restaurant_id' });
db.MainCategory.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id' });

db.Restaurant.hasMany(db.Order, { foreignKey: 'restaurant_id' });
db.Order.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id' });

// Branch Model
db.Branch.hasMany(db.BranchMenuStatus, { foreignKey: 'branch_id' });
db.BranchMenuStatus.belongsTo(db.Branch, { foreignKey: 'branch_id' });

db.Branch.hasMany(db.Order, { foreignKey: 'branch_id' });
db.Order.belongsTo(db.Branch, { foreignKey: 'branch_id' });

// MainCategory Model
db.MainCategory.hasMany(db.MainMenu, { foreignKey: 'main_category_id' });
db.MainMenu.belongsTo(db.MainCategory, { foreignKey: 'main_category_id' });

// MainMenu Model
db.MainMenu.hasMany(db.BranchMenuStatus, { foreignKey: 'main_menu_id' });
db.BranchMenuStatus.belongsTo(db.MainMenu, { foreignKey: 'main_menu_id' });

db.MainMenu.hasMany(db.OptionCategory, { foreignKey: 'main_menu_id' });
db.OptionCategory.belongsTo(db.MainMenu, { foreignKey: 'main_menu_id' });

db.MainMenu.hasMany(db.OrderItem, { foreignKey: 'main_menu_id' });
db.OrderItem.belongsTo(db.MainMenu, { foreignKey: 'main_menu_id' });

// OptionCategory Model
db.OptionCategory.hasMany(db.OptionMenu, { foreignKey: 'option_category_id' });
db.OptionMenu.belongsTo(db.OptionCategory, { foreignKey: 'option_category_id' });

// Order Model
db.Order.hasMany(db.SubOrder, { foreignKey: 'order_id' });
db.SubOrder.belongsTo(db.Order, { foreignKey: 'order_id' });

// SubOrder Model
db.SubOrder.hasMany(db.OrderItem, { foreignKey: 'sub_order_id' });
db.OrderItem.belongsTo(db.SubOrder, { foreignKey: 'sub_order_id' });

// OrderItem Model
db.OrderItem.hasMany(db.OrderItemOption, { foreignKey: 'sub_order_item_id' });
db.OrderItemOption.belongsTo(db.OrderItem, { foreignKey: 'sub_order_item_id' });

// Option categories Model
db.OptionCategory.hasMany(db.OptionMenu, { foreignKey: 'option_category_id' });
db.OptionMenu.belongsTo(db.OptionCategory, { foreignKey: 'option_category_id' });

// OptionMenu Model
db.OptionMenu.hasMany(db.OrderItemOption, { foreignKey: 'option_menu_id' });
db.OrderItemOption.belongsTo(db.OptionMenu, { foreignKey: 'option_menu_id' });


module.exports = db;