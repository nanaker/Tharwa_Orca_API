module.exports = function(express,VirementController){
   
    const router = express.Router();
    router.post('/VirementClientTh',(req,res) =>{
        VirementController.Tranfer_ClientTH(req,res);
    });

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*--------------------------------Service pour les virements entre le meme compte d'un client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    router.post('/local',(req,res) =>{
        VirementController.Virement_local(req,res);
    });
    return router;
}