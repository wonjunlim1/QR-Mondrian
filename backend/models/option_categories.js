module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OptionCategory', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      main_menu_id: {
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
      tableName: 'option_categories',
      timestamps: false
    });
  };
  