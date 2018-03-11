/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TarifCommission', {
    Code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    montant: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Pourcentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'TarifCommission'
  });
};
