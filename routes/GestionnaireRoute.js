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
    return router;
}