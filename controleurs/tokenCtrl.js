//imports
const request = require('request');
const hostname = 'http://localhost:8081/oauth/info'; //serveur d'authentification

//const hostname = ''

//exports
module.exports = function (token, callback){
    
    // construire une requette http vers le serveur d'authentification pour vérifeir le access token 
    const options = {  
        url: hostname, // l'URL du service de validation du Token 
        method: 'GET', //methode d'accès
        headers: {
            "Authorization": "Bearer " + token,  //mettre le token à vérifier dans le header
            "Cache-Control": "no-cache", //interdire la sauvegarde de la requete en cache
            "Content-Type": 'application/x-www-form-urlencoded' //format des paramètres
        }

       
    };

    request(options, function (err, res,body){
        
        if(err){ //en cas d'ereur interne du serveur d'authentification
            console.log(err);
            response = {
                'statutCode' : 500,
                'error'  : 'can\'t verify token'           
               }
            callback(response);
          
            
        }
        else {
            
            if(res.statusCode == 401){  //si le token est invalide
                response = {
                    'statutCode' : 401, //unothorized
                    'error'  : 'unothorized user'           
                   }
                callback(response);
                
                
            }
            else { //si le token est valide
                
                bodyJson = JSON.parse(body); //récupérer les information de l'utilisateur :
                appId = bodyJson.applicationId; // l'ID de l'application depuis laquelle il s'est authentifié
                id = bodyJson.userId; // son ID
                exp = bodyJson.expiresIn; // le temps restant avant l'expiration du token 
                response = {
                    'statutCode' : 200, //OK
                    'userId'  : id ,
                    'appId'  :    appId     
                   }
                callback(response);
                
            } 
        }   
    })
    

}

