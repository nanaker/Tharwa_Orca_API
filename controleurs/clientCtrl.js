//imports

var tokenController = require('./tokenCtrl');

//exports
module.exports = function(Client,sequelize) {


/*---------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------procedure pour ajouter un client à la BDD ------------------------------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 

    function addClient(req,res,callback) {

        //récupérer les paramètres de l'utilisateur depuis le body de la requete
        var id = req.body.userId;
        var type = parseInt(req.body.type);
        var nom = req.body.Nom;
        var prenom = req.body.Prenom;
        var adresse = req.body.Adresse;
        var fonction = req.body.Fonction;
        var imagePath =  req.file.path;

        if(id == null || type == null || nom == null || prenom == null || adresse == null || fonction == null || imagePath == null){
            response = {
                'statutCode' : 400, //bad request
                'error'  : 'missing parameters'           
               }
            callback(response);
        }

        const value = sequelize.escape(id);
        var idd = sequelize.literal(`IdUser = CONVERT(varchar, ${value})`) 
        Client.findOne({
            attributes:['IdUser'],
            where: {  idd }
            
        })
        .then(function(clientFound){ 

            if(clientFound){ //si'il existe :
                response = {
                    'statutCode' : 409, // conflit
                    'error':'Client already exists'         
                }
                callback(response);
                
            }
            else{ 
                  //créer le nouveau client :
                   var newClient = Client.create({
                       IdUser : id,
                       Nom : nom,
                       Prenom : prenom,
                       Adresse : adresse,
                       Fonction : fonction,
                       Photo :  imagePath,
                       Type : type
  
                   }).then(function(newClient){
                        response = {
                            'statutCode' : 201, // new ressource created
                            'id': newClient.IdUser        
                        }
                        callback(response);
                   })
                   .catch(err => {
                        response = {
                            'statutCode' : 500, // new ressource created
                            'error':'Unable to add client'       
                        }
                        callback(response);
                        console.error('Unable to add client', err);
                    });
           
           }
        })
        .catch(function(err){
                response = {
                    'statutCode' : 500, // new ressource created
                    'error':'Unable to add client'       
                }
                callback(response);
                console.error('Unable to add user', err);
        });

    }



/*---------------------------------------------------------------------------------------------------------------------*/

/*-----------------------------procedure pour récupérer les informations d'un client authentifié' ---------------------------*/   

/*---------------------------------------------------------------------------------------------------------------------*/
 
function getClientInfo (clientId,callback){
    
    Client.findOne({
        attributes:['Nom','Prenom','Fonction','Type'],
        where: {  'IdUser' : clientId}
    }).then( (clientFound)=>{

        if(clientFound){
            response = {
                'statutCode' : 200, // success
                'Nom':clientFound.Nom,
                'Prenom': clientFound.Prenom,
                'Fonction' : clientFound.Fonction,
                'Type' : clientFound.Type          
            }
            callback(response);
        }else {
            response = {
                'statutCode' : 404, //not Found
                'error':'User not found'          
            }
            callback(response);
        }
    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : 500, 
            'error':'Can\'t verify client'        
        }
        callback(response);
    });

}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*---------------Procedure pour recuperer l'historique de tout les virements et commissions d'un client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function historique(req,res){

     //récupérer le Access token du banquier qui veut valider le compte banquaire
    // const token = req.headers['token']; 
     const token='BiIPt8QusRfK6LqpcmHU1SkJ8yL4W79DhBuFeDkXgEpnCk3y1E4Yg56ljkpcVEPN8wnpEluBVKMGgHMZMVrJdLZ5YCe4ux5GqI1yYIuEO4FsJhN0aAi62a3PKViS51JlAWRrd8jldeREXXJwQ3OG96vgXi8Fon3HLyuhBlODiZyEOevVTT7c6UiKRELL2uRTxDE3aGP85b8Nbvh7Op7FWDjedqdadpt3EmlviLhTtMrr34PkpNKB2YCjb1i3xA4';
     var iduser={};
     tokenController(token, function(response){
 
         if (response.statutCode == 200){
             iduser=response.userId;
             console.log('user '+iduser);
             sequelize.query('exec historique $userid',
                    {
                          bind: {
                                 userid:iduser
                                }
                        }).then((historique) => {
                            console.log(historique);
                            return res.status(200).json({'historique':JSON.parse(JSON.stringify(historique[0]))});
                        
                     }).catch(err =>  res.status(401).json({'error': 'requete non execute'})); 
 
         }else {
             
             res.status(response.statutCode).json({'error': response.error});
         }
     });
}

    
    //exporter les services :
    return {addClient,getClientInfo,historique};

}