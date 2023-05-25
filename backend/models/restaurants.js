module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Restaurant', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      }
    }, {
      tableName: 'restaurants',
      timestamps: false
    });
  };
  