module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MainCategory', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      restaurant_id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      display_order: {
        type: DataTypes.INTEGER
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    }, {
      tableName: 'main_categories',
      timestamps: false
    });
  };
  