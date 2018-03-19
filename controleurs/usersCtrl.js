//imports

var crypto = require('crypto');
var http = require("http");
const request = require('request');
var hostname = 'http://localhost:8000/oauth/info';
var tokenVerifier = require('./tokenCtrl');




//Routes
module.exports = function(User,sequelize) {

 //service d'inscription ( création du compte utilisateur) **pas encore finalisé**
function inscription (req,res){
        //récupérer les paramètres de l'utilisateur depuis le body de la requete
        var id = req.body.userId;
        var Username = req.body.UserName;
        var Password = req.body.Pwd;
        var Type = req.body.Type;
       
        //Vérifier tous les paramètres obligatoires sont présents :
        if(id == null || Username == null || Password == null || Type == null){
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }

        
       //tout d'abord, vérifier si l'utilisateur est déjà présent dans la BDD THARWA
       const value = sequelize.escape(id);
       var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`)     
       User.findOne({
            attributes:['userId'],
            where: {  idd }
            
        })
        .then(function(userFound){ 
           if(userFound){ //si'il existe :
              
              return res.status(409).json({'error':'User already exists'}); //  conflict
            

           }else{
                  //hasher le mot de passe :
                  const passwordHash = crypto.createHmac('sha256', Password).digest('hex');

                  //créer le nouveau utilisateur :
                   var newUser = User.create({
                       userId : id,
                       username : Username,
                       type : Type,
                       password : passwordHash
                      

                   }).then(function(newUser){
                        return res.status(201).json({'Id': newUser.userId}); // new ressource created
                   })
                   .catch(err => {
                    return res.status(500).json({'error':'Unable to add user:'}); //interne error
                    console.error('Unable to add user:', err);
                    });
           
           }
        })
        .catch(function(err){
            return res.status(500).json({'error':'Can\'t verify parameters'}); //interne error
            console.log(err);
        });

    }

 //service pour récupérer les informations du tableau de bord d'un utilisateur authentifié
function dashBoard  (req,res){
        
            const token = req.headers['token']; //récupérer le Access token
           
            tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification
            
            if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
                
                id = response.userId; //recupérer le id de l'utilisateur
                const value = sequelize.escape(id);
                var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`)
                User.findOne({ //rechercher l'utilisateur dans La BDD THARWA
                    attributes:['userId','username','type'],
                    where: {  idd }
                    
                })
                .then(function(userFound){
                   if(userFound){ //si l'utilisateur est trouvé
                      
                      //vérifier la compatibilité entre l'utilisateur et l'application qu'il utilise ( web ou mobile)
                      if((userFound.type == 0 && response.appId == 'clientweb') || (userFound.type == 1 && response.appId == 'clientweb')|| (userFound.type == 2 && response.appId == 'clientmobile')){
                            res.status(200).json({'userId':userFound.userId,
                                                  'userName': userFound.username,
                                                  'type' : userFound.type  });
                      }else {
                        res.status(401).json({'error':'Unothorized application'}); //unothorized
                      }
                   }else{
                     // utilisateur non trouvé      
                    res.status(404).json({'error':'User not found'});
                   }
                })
                .catch(function(err){
                    //Si une erreur interne au serveur s'est produite :
                     res.status(500).json({'error':'Can\'t verify user'}); 
                     console.log(err);
                });
            
            }else {
                //si le access token n'est pas valide ou une erreur interne au serveur d'authentification s'est produite:
                res.status(response.statutCode).json({'error': response.error});
            }

        });
        
        
        
    }
    return {inscription,dashBoard};
}
