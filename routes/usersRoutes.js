
module.exports = function(express,usersController){
   
    const router = express.Router();
    router.post('/BankerInscription',(req,res) =>{
        usersController.BankerInscription(req,res);
    });

    router.get('/dashBoard',(req,res) =>{
        usersController.dashBoard(req,res);
    });

    return router;
}


