module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MainMenu', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      main_category_id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.STRING
      },
      image_url: {
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
      tableName: 'main_menus',
      timestamps: false
    });
  };
  