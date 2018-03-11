
module.exports = function(express,usersController){
   
    const router = express.Router();
    router.post('/inscription',(req,res) =>{
        usersController.inscription(req,res);
    });

    router.get('/dashBoard',(req,res) =>{
        usersController.dashBoard(req,res);
    });

    return router;
}


