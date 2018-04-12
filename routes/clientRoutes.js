module.exports = function(express,chemin,tokenController,accountController,clientController){
   
    const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------- Service pour récupérer les informations d'un client'--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/info',(req,res) =>{
    
    const token = req.headers['token']; //récupérer le Access token
       
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                clientController.getClientInfo(OauthResponse.userId,(response)=>{
                   if(response.statutCode == 200){
                        Nom = response.Nom;
                        Prenom = response.Prenom;
                        Fonction = response.Fonction;
                        Adresse = response.Adresse;
                        Type = response.Type;
                        Photo = response.Photo;
                        accountController.getClientAccounts(OauthResponse.userId,(response2)=>{
                            if (response2.statutCode == 200){
                                res.status(response2.statutCode).json({ 'id':OauthResponse.userId,
                                                                        'Nom': Nom,
                                                                        'Prenom' : Prenom,
                                                                        'Fonction': Fonction,
                                                                        'Adresse': Adresse,
                                                                        'Type' : Type,
                                                                        'comptes': response2.Comptes});
                            }else{
                                res.status(response2.statutCode).json({'error': response2.error});
                            }

                        });
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

/*----------------------------- Service pour récupérer l'image de profile d'un client'--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/avatar',(req,res) =>{

    const token = req.headers['token']; //récupérer le Access token
       
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            clientController.getClientInfo(OauthResponse.userId,(response)=>{
               if(response.statutCode == 200){
                    console.log('here')
                    Photo = response.Photo;
                    res.sendFile(Photo, {"root": chemin});
                     
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

/*----------------------------------------Service pour l'historique des virements d'un client ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.get('/historique',(req,res) =>{

    const token = req.headers['token']; //récupérer le Access token
           
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            clientController.historique(OauthResponse.userId,(response)=>{
               if(response.statutCode == 200){
                res.status(200).json({'historique': response.historique});
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

/*----------------------------------------Service pour Recuperer les taux de change a partir d'une base  ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

router.post('/tauxChange',(req,res) =>{

    const token = req.headers['token']; //récupérer le Access token
    var b=req.body.base
           
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            clientController.tauxChange(b,(response)=>{
               if(response.statutCode == 200){
                res.status(200).json({'Taux': response.rates});
               } else {
                res.status(response.statutCode).json({'error': response.error}); 
               }
               
            });
        }else {
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });
    
});

    //exports :
   return router;

}