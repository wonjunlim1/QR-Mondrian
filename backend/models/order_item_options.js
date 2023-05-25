module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderItemOption', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sub_order_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      option_menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      option_menu_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'order_item_options',
      timestamps: false
    });
  };
  