//imports



//exports
module.exports = function(Client,sequelize) {

    function addClient(req,res,callback) {

        //récupérer les paramètres de l'utilisateur depuis le body de la requete
        var id = req.body.userId;
        var type = parseInt(req.body.type);
        var nom = req.body.Nom;
        var prenom = req.body.Prenom;
        var adresse = req.body.Adresse;
        var fonction = req.body.Fonction;
        var imagePath =  req.file.path;

        const value = sequelize.escape(id);
        var idd = sequelize.literal(`userId = CONVERT(varchar, ${value})`) 
        Client.findOne({
            attributes:['IdUser'],
            where: {  idd }
            
        })
        .then(function(clientFound){ 

            if(clientFound){ //si'il existe :
                response = {
                    'statutCode' : 409, // new ressource created
                    'error':'Client already exists'         
                }
                callback(response);
                //res.status(409).json({'error':'Client already exists'});
            }
            else{ 
                  //créer le nouveau client :
                   var newClient = Client.create({
                       IdUser : id,
                       Nom : nom,
                       Prenom : prenom,
                       Adresse : adresse,
                       Fonction : fonction,
                       Photo :  imagePath,
                       Type : type
  
                   }).then(function(newClient){
                        response = {
                            'statutCode' : 201, // new ressource created
                            'id': newClient.IdUser        
                        }
                        callback(response);
                   })
                   .catch(err => {
                        response = {
                            'statutCode' : 500, // new ressource created
                            'error':'Unable to add client'       
                        }
                        callback(response);
                        console.error('Unable to add user', err);
                    });
           
           }
        })
        .catch(function(err){
                response = {
                    'statutCode' : 500, // new ressource created
                    'error':'Unable to add client'       
                }
                callback(response);
                console.error('Unable to add user', err);
        });

    }
    
    //exporter les services :
    return {addClient};

}