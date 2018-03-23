//imports
var crypto = require('crypto');
var tokenVerifier = require('./tokenCtrl');
var multer = require('Multer');
var path = require('path');


//exports
module.exports = function(User,sequelize) {


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------service de création du compte utilisateur pour banquier---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    function BankerInscription (req,res){
        
        
           //récupérer le Access token du gestionnaire qui veut créer le compte pour le banquier

            const token = req.headers['token']; 

            tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification
            
            if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
                
                id = response.userId; //recupérer le id du gestionnaire
                const value = sequelize.escape(id);
                var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`)
                User.findOne({ //rechercher l'utilisateur dans La BDD THARWA
                    attributes:['userId','type'],
                    where: {  idd }
                    
                })
                .then(function(userFound){
                   if(userFound){ //si le gestionnaire est trouvé
                      
                      //vérifier son type (que c'est vraiment un gestionnaire)
                      if(userFound.type == 0 ){
                           //procéder à la création du compte utilisateur pour le banquier : 
                           createUserAccount(req,res,1,(response) => {
                               if (response.statutCode == 201){
                                  res.status(response.statutCode).json({'id':response.Id});
                               }else {
                                  res.status(response.statutCode).json({'error':response.error});
                               }
                                
                           });

                      }else {
                            //Ce n'est pas un gestionnaire -> l'opération de création n'est pas permise
                            res.status(401).json({'error':'Unothorized Operation'}); 
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


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------service de création du compte utilisateur pour un client--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


function ClientInscription(req,res,erreur){

    const storage = multer.diskStorage({
        destination: 'C:/avatars',
        filename: function (req, file, callback) {
            callback(null,'avatar'+path.extname(file.originalname));
        }
      });

    const upload = multer({ storage: storage }).single('avatar');

    upload(req,res,(err)=> {
    if (err){
        res.status(500).json({'error':'Can\'t upload profile image'});
    }else {
        
         // const imagePath =  req.file.path;
         createUserAccount(req, res,2,(response)=>{
            //si le compte utilisateur a été bien créé, on procède à la création du compte banquaire
            if (response.statutCode == 201){
                erreur(false);
               // res.status(response.statutCode).json({'id':response.Id});
             }else {
                erreur(true);
                res.status(response.statutCode).json({'error':response.error});
             }
         });
     }
    });
    

}

/*---------------------------------------------------------------------------------------------------------------------*/

/*---------------service pour récupérer les informations du tableau de bord d'un utilisateur authentifié---------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 
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


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*                                      Procedure de création des comptes utilisateur                                   */
 
/*-----------------------------------------------------------------------------------------------------------------------*/   

    

    function createUserAccount(req, res,type,callback){
      
        //récupérer les paramètres de l'utilisateur depuis le body de la requete
        var id = req.body.userId;
        var Username = req.body.UserName;
        var Password = req.body.Pwd;
        var Type = type;
        var tel = req.body.Tel;
        //Vérifier que tous les paramètres obligatoires sont présents :
        if(id == null || Username == null || Password == null || Type == null|| tel == null){
            response = {
                'statutCode' : 400, //bad request
                'error'  : 'missing parameters'           
               }
            callback(response);
           
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
                response = {
                    'statutCode' : 409, //  conflict
                    'error'  : 'User already exists'           
                }
                callback(response);
            }
            else{
                  //hasher le mot de passe :
                  const passwordHash = crypto.createHmac('sha256', Password).digest('hex');
  
                  //créer le nouveau utilisateur :
                   var newUser = User.create({
                       userId : id,
                       username : Username,
                       type : Type,
                       password : passwordHash,
                       numTel : tel
  
                   }).then(function(newUser){
                        response = {
                            'statutCode' : 201, // new ressource created
                            'Id'  : newUser.userId           
                        }
                        callback(response);
                       
                   })
                   .catch(err => {
                        response = {
                            'statutCode' : 500, //internal error
                            'error':'Unable to add user'          
                        }
                        callback(response);
                        console.error('Unable to add user', err);
                    });
           
           }
        })
        .catch(function(err){
            response = {
                'statutCode' : 500, //internal error
                'error':'Can\'t verify parameters'          
            }
            callback(response);
            console.log(err);
        });
  
     }



    //exporter les services :
    return {BankerInscription,dashBoard,ClientInscription};
}
