module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BranchMenuStatus', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      branch_id: {
        type: DataTypes.INTEGER
      },
      main_menu_id: {
        type: DataTypes.INTEGER
      },
      active: {
        type: DataTypes.BOOLEAN
      },
      updated_at: {
        type: DataTypes.DATE
      }
    }, {
      tableName: 'branches_menu_status',
      timestamps: false
    });
  };
  