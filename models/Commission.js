/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Commission', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CodeCommission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TarifCommission',
        key: 'Code'
      }
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    NumCompte: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Compte',
        key: 'Num'
      }
    }
  }, {
    tableName: 'Commission'
  });
};
