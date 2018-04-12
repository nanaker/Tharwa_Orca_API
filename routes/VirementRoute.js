module.exports = function(express,VirementController,tokenController){
   
    const router = express.Router();
    router.post('/VirementClientTh',(req,res) =>{
        VirementController.Tranfer_ClientTH(req,res);
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour les virements entre le meme compte d'un client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    router.post('/local',(req,res) =>{
        const token = req.headers['token']; //récupérer le Access token
        var montant=req.body.montant;
        var type1 = req.body.type1;
        var type2=req.body.type2;
        var motif=req.body.motif;

        if(montant == null || type1 == null || type2== null || motif == null){
            return res.status(400).json({'error':'missing parameters'}); //bad request
        }
         else{  
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            VirementController.Virement_local(OauthResponse.userId,montant,type1,type2,motif,(response)=>{
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
       
    }
    });
    return router;
}