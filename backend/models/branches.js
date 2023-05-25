module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Branch', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      restaurant_id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      }
    }, {
      tableName: 'branches',
      timestamps: false
    });
  };
  