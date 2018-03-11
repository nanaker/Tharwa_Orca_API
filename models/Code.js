/* jshint indent: 2 */
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Code', {
    
    codeId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    expires: {
      type: DataTypes.STRING,
      allowNull: false
    }
   
  }, {
    tableName: 'Code'
  });
};
