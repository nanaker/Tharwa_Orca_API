/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Compte', {
    Num: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    Balance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    DateCreation: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CodeMonnaie: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Monnaie',
        key: 'Code'
      }
    },
    IdUser: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Client',
        key: 'IdUser'
      }
    },
    Etat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TypeCompte: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Compte'
  });
};
