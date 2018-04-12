/* jshint indent: 2 */
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numTel: {
      type: DataTypes.STRING,
      allowNull: true
    }
    
   
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'Users'
  });
};
