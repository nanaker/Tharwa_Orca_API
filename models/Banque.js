/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Banque', {
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    RaisonSocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Adresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Mail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Banque'
  });
};
