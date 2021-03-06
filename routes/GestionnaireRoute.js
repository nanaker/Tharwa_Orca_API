module.exports = function(express,GestionnaireController,tokenController){
   
    const router = express.Router();
    
   

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    router.get('/listBanque',(req,res) =>{
        const token = req.headers['token']; //récupérer le Access token
         
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            GestionnaireController.listBanque((response)=>{
               if(response.statutCode == 200){
                res.status(200).json({'Banques': response.banques});
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

/*--------------------------------Service pour recuperer la liste des banques ------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/listBanquiers',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.listBanquiers((response)=>{
           if(response.statutCode == 200){
            res.status(200).json({'Banquiers': response.banquiers});
           } else {
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});

router.get('/listVirementEx',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.listVirementEx((response)=>{
           if(response.statutCode == 200){
            res.status(200).json({'Virements': response.virements});
           } else {
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});

router.put('/updateprofil',(req,res) =>{
    const token = req.headers['token']; //récupérer le Access token
    var name=req.body.username
    var tel=req.body.numtel
     
tokenController(token, function(OauthResponse){
    if (OauthResponse.statutCode == 200){
        GestionnaireController.updateProfil(name,tel,OauthResponse.userId,(response)=>{
           if(response.statutCode == 200){
            res.status(200).json({'succe': response.succe});
           } else {
            res.status(response.statutCode).json({'error': response.error}); 
           }
           
        });
    }else {
        res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
    }
});
   

});


    return router;
}