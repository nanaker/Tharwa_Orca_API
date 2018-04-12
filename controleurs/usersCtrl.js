//imports
var crypto = require('crypto');
var multer = require('multer');
var path = require('path');


//exports
module.exports = function(User,sequelize) {

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


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------prodédure de création du compte utilisateur pour banquier---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    function BankerInscription (idGestionnaire,req,res){
        
                id = idGestionnaire; //recupérer le id du gestionnaire
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
         
    }


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------------Procedure pour aploader un fichier au server-------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


function FileUpload(req,res,distination,fileName,callback){

    const storage = multer.diskStorage({
        destination: distination , //'C:/avatars'
        filename: function (req, file, callback1) {
            callback1(null,fileName+path.extname(file.originalname));
        }
      });

    const upload = multer({ storage: storage }).single(fileName);

    upload(req,res,(err)=> {
    if (err){
        response = {
            'statutCode' : 500, //  internal error
            'error':'Can\'t upload profile image'           
        }
        callback(response);
    }else {
       
        response = {
            'statutCode' : 200 //  success         
        }
        callback(response);
     }
    });
    

}

/*---------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------procedure pour récupérer les informations d'un utilisateur ---------------------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 
function getUserInfo  (UserId,callback){
        
             
                id = UserId; //recupérer le id de l'utilisateur
                const value = sequelize.escape(id);
                var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`)
                User.findOne({ //rechercher l'utilisateur dans La BDD THARWA
                    attributes:['userId','username','type','numTel'],
                    where: {  idd }
                    
                })
                .then(function(userFound){
                   if(userFound){ //si l'utilisateur est trouvé
                      
                      //vérifier la compatibilité entre l'utilisateur et l'application qu'il utilise ( web ou mobile)
                      if((userFound.type == 0 && response.appId == 'clientweb') || (userFound.type == 1 && response.appId == 'clientweb')|| (userFound.type == 2 && response.appId == 'clientmobile')){
                            response = {
                                'statutCode' : 200, // success
                                'userId':userFound.userId,
                                'userName': userFound.username,
                                'type' : userFound.type,
                                'tel' : userFound.numTel          
                            }
                            callback(response);
                      }else {
                            response = {
                                'statutCode' : 401, //unothorized
                                'error':'Unothorized application'          
                            }
                            callback(response);
                      }
                   }else{
                     // utilisateur non trouvé  
                        response = {
                            'statutCode' : 404, //not Found
                            'error':'User not found'          
                        }
                        callback(response);    
                   }
                })
                .catch(function(err){
                    //Si une erreur interne au serveur s'est produite :
                    console.log(err);
                    response = {
                        'statutCode' : 500, 
                        'error':'Can\'t verify user'        
                    }
                    callback(response);
                    
                     
                });
            
}





    //exporter les services :
    return {BankerInscription,getUserInfo,FileUpload,createUserAccount};
}
