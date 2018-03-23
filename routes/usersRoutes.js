


module.exports = function(express,usersController,clientController,accountController){
   
    const router = express.Router();
    

    router.post('/BankerInscription',(req,res) =>{
        usersController.BankerInscription(req,res);
    });

    router.post('/ClientInscription',(req,res) =>{

        // 1- Création du compte utilisateur pour le client
        usersController.ClientInscription(req,res,(err)=>{
            if(!err){
                // 2- Ajout du client à la table Client dans la BDD
                clientController.addClient(req,res,(response)=>{
                     if(response.statutCode == 201){
                        // 3- Création du compte banquaire
                        accountController.CreateCourantAccount(response.id);
                     }
                     else{
                        res.status(response.statutCode).json({'error':response.error}); 
                     }
                });
            }
        });
    });

    router.get('/dashBoard',(req,res) =>{
        usersController.dashBoard(req,res);
    });

    return router;
}


