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

const sequelize = new Sequelize('THARWA', 'cnx', 'orca@2018', {
  host: 'localhost',
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
const Client = sequelize.import(__dirname + "/models/Client");
const Compte = sequelize.import(__dirname + "/models/Compte");
const Virement = sequelize.import(__dirname + "/models/Virement");

//Controllers
const tokenController = require('./controleurs/tokenCtrl');
const usersController = require('./controleurs/usersCtrl')(User,sequelize);
const clientController = require('./controleurs/clientCtrl')(Client,sequelize);
const accountController = require('./controleurs/accountCtrl')(Client,Compte,sequelize);
const VirementController = require('./controleurs/VirementCntrl')(Virement,Compte,sequelize,Client);

//Routes
const usersRoute = require('./routes/usersRoutes')(express,tokenController,usersController,clientController,accountController);
server.use('/users',usersRoute);

const accountsRoute = require('./routes/accountsRoutes')(express,tokenController,accountController);
server.use('/accounts',accountsRoute);

const clientRoute = require('./routes/clientRoutes')(express,tokenController,accountController,clientController);
server.use('/clients',clientRoute);


const VirementRoute = require('./routes/VirementRoute')(express,VirementController,tokenController);
server.use('/virement',VirementRoute);

//mettre le serveur en écoute 

server.listen(8080,function (){
   console.log("Serveur en écoute !");
});

