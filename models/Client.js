/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Client', {
    IdUser: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'Id'
      }
    },
    Nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Adresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NumTel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Fonction: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Photo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Client'
  });
};
