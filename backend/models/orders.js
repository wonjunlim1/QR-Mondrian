module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      table_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'orders',
      timestamps: false
    });
  };
  