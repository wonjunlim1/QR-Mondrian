module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderItem', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sub_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      main_menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    main_menu_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'order_items',
    timestamps: false
  });
};
