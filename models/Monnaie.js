/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Monnaie', {
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Monnaie'
  });
};
