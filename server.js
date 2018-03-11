//imports
const express = require("express");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

//instanciation du serveur
var server = express();

//Config de Body-Parser
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());


// config of database THARWA

const sequelize = new Sequelize('THARWA', 'tharwa', 'orca@2018', {
  host: 'den1.mssql6.gear.host',
  dialect: 'mssql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  
});

sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      
    
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });




//Models
const User = sequelize.import(__dirname + "/models/Users");

//Controllers
const usersController = require('./controleurs/usersCtrl')(User,sequelize);

//Routes
const usersRoute = require('./routes/usersRoutes')(express,usersController);
server.use('/users',usersRoute);


//mettre le serveur en écoute 

server.listen(8080,function (){
   console.log("Serveur en écoute !");
});

