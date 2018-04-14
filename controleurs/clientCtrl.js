//imports

var tokenController = require('./tokenCtrl');
var oxr = require('open-exchange-rates'),
	fx = require('money');

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
        attributes:['Nom','Prenom','Fonction','Type','Adresse','Photo'],
        where: {  'IdUser' : clientId}
    }).then( (clientFound)=>{

        if(clientFound){
            response = {
                'statutCode' : 200, // success
                'Nom':clientFound.Nom,
                'Prenom': clientFound.Prenom,
                'Fonction' : clientFound.Fonction,
                'Adresse':clientFound.Adresse,
                'Type' : clientFound.Type ,
                'Photo'  : clientFound.Photo        
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
function historique(iduser,callback){

             

             sequelize.query('exec historique $userid',
                    {
                          bind: {
                                 userid:iduser
                                }
                        }).then((historique) => {
                            response = {
                                'statutCode' : 200, // success
                                'historique':JSON.parse(JSON.stringify(historique[0]))        
                            }
                            callback(response); 
                            
                        
                        }).catch(err => {
                            response = {
                              'statutCode' : 500, // success
                              'error': 'erreur dans l\'execution de la requete'          
                          }
                          callback(response) });
 
         
}
function tauxChange(base,callback){

    oxr.set({ app_id: 'a8a5c2a6302b453f9266c7254b043f6a' });
    oxr.latest(function() {
        // Apply exchange rates and base rate to `fx` library object:
        
        fx.rates = oxr.rates;
        fx.base = oxr.base;
        
        switch (base)
        {
            case 'USD':  { 
            response = {
                'statutCode' : 200, // success
                'rates':[{
                    'EUR':fx(1).from('USD').to('EUR')   ,
                    'DZD':fx(1).from('USD').to('DZD')  }  ]
                 
            }
            callback(response); 
        }
            break ;
            case 'EUR': {

                response = {
                    'statutCode' : 200, // success
                    'rates':[{
                        'USD':fx(1).from('EUR').to('USD')   ,
                        'DZD':fx(1).from('EUR').to('DZD')  }  ]
                     
                }
                callback(response); 
            }
            
            break ;
            case 'DZD':  {
                response = {
                    'statutCode' : 200, // success
                    'rates':[{
                        'EUR':fx(1).from('DZD').to('EUR')   ,
                        'USD':fx(1).from('DZD').to('USD')  }  ]
                     
                }
                
                callback(response); 
            }
           
            break ;
            
            
    
    
        }
       
    });


}

    
    //exporter les services :
    return {addClient,getClientInfo,historique,tauxChange};

}