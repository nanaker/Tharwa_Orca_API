module.exports = function(express,tokenController,accountController){
   
    const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Service de validation d'un compte banquire------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.put('/validate',(req,res) =>{

    //récupérer le Access token du banquier qui veut valider le compte banquaire
    const token = req.headers['token']; 
    tokenController(token, function(OauthResponse){
        if (OauthResponse.statutCode == 200){
            numCmpt = req.body.num;
            if(numCmpt == null){
                res.status(400).json({'error' : 'missing account number '});
            }else {
               
                accountController.validateAccount(numCmpt,(response)=>{
                    if(response.statutCode == 200){
                        res.status(200).json({'success' : 'account validated'});
                    } else {
                        res.status(response.statutCode).json({'error' : response.error});
                    }
                    
                 });
            }
        
        }else {
            
            res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
        }
    });

    
});


    return router;

}