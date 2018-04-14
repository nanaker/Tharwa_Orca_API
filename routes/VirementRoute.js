<<<<<<< HEAD
module.exports = function(express,VirementController){

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour le virement vers un autre client Tharwa------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
 
=======
module.exports = function(express,VirementController,tokenController){
>>>>>>> 03ab56c1925ed2ca3425789739bf05d965d119d0
   
    const router = express.Router();
    router.post('/VirementClientTh',(req,res) =>{
        VirementController.TranferClientTH(req,res);
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


/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour la liste des virements non encore traités------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
 

router.get('/ListVirementNonTraites',(req,res) =>{
    VirementController.Listes_virements_non_traites(req,res);
});




    return router;
}