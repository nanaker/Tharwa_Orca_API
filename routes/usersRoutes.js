
var multer  = require('multer')
var upload = multer()

module.exports = function(express,tokenController,usersController,clientController,accountController){
   
    const router = express.Router();
    
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------------      Service d'inscription du banquier      -------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    router.post('/BankerInscription',(req,res) =>{
        
        //récupérer le Access token du gestionnaire qui veut créer le compte pour le banquier
        const token = req.headers['token']; 
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                usersController.BankerInscription(OauthResponse.userId,req,res);
            }else {
                
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });
        
    });


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*-------------------------------------      Service d'inscription du client      ---------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


    router.post('/ClientInscription',(req,res) =>{

        // 1- Uploader l'image du client
        //console.log(req.body.UserName)
        usersController.FileUpload(req,res,'./uploads',(response)=>{
            
            if(response.statutCode == 200){
                // 2- Création du compte utilisateur pour le client
                usersController.createUserAccount(req, res,2,(response1)=>{
                    if(response1.statutCode==201){
                        // 3- Ajout du client à la table Client dans la BDD
                        clientController.addClient(req,res,(response2)=>{
                            if(response2.statutCode == 201){
                                // 4- Création du compte banquaire
                                accountController.CreateCourantAccount(response2.id,(response3)=>{
                                if(response3.statutCode == 201){
                                    res.status(response3.statutCode).json({'NumCompte':response3.NumCmpt});
                                }else {
                                    res.status(response3.statutCode).json({'error':response3.error});
                                }
                                });
                            }
                            else{
                                res.status(response2.statutCode).json({'error':response2.error}); 
                            }
                        });
                    }
                    else{
                        res.status(response1.statutCode).json({'error':response1.error});
                    }
                });
            }else{
              res.status(response.statutCode).json({'error':response.error});
            }

        });
        
            
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------- Service pour récupérer les informations du tableau de bord--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    router.get('/dashBoard',(req,res) =>{


        const token = req.headers['token']; //récupérer le Access token
           
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                 usersController.getUserInfo(OauthResponse.userId,(response)=>{
                   if(response.statutCode == 200){
                    res.status(200).json({'userId': response.userId,
                                          'userName': response.userName,
                                          'type' : response.type});
                   } else {
                    res.status(response.statutCode).json({'error': response.error}); 
                   }
                   
                });
            }else {
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });

        
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------Service pour récupérer les informations d'un client---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

    return router;
}


