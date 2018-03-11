/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Virement', {
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Motif: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Statut: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Justificatif: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NumOrdreVirement: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'OrdreVirement',
        key: 'Num'
      }
    },
    NomEmetteur: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CompteEmmetteur: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BanqueEmmeteur: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Banque',
        key: 'Code'
      }
    },
    NomDestinataire: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CompteDestinataire: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BanqueDestinataire: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Banque',
        key: 'Code'
      }
    },
    Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Virement'
  });
};
