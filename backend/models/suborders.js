module.exports = (sequelize, DataTypes) => {
    return sequelize.define('SubOrder', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      partial_price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order_status: {
        type: DataTypes.STRING,
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
      tableName: 'sub_orders',
      timestamps: false
    });
  };
  