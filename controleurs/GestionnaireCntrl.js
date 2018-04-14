


//Routes
module.exports = function(Virement,User,Banque,sequelize) {

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement vers un autre client THARWA----------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function listBanque(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
     
     Banque.findAll()
     .then(function (banques) {
        
        response = {
            'statutCode' : 200, // success
            'banques': banques          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}


function listBanquiers(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
     
     User.findAll(

       { attributes:['userId','username','type','numTel']
        ,where:{'type' :1}}
     )
     .then(function (banquiers) {
        
        response = {
            'statutCode' : 200, // success
            'banquiers': banquiers          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}
function listVirementEx(callback){
    // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
    const Op = sequelize.Op;
     Virement.findAll(

       { 
        where:{ 
            type: {
              [Op.or]: [1, 2]
            } }
    }
     )
     .then(function (virements) {
        
        response = {
            'statutCode' : 200, // success
            'virements': virements          
        }
        callback(response);
        
    }).catch(function(err) {
        
        response = {
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
    });
    

}
function updateProfil(name,tel,iduser,callback){
   
                  User.update(

                      { numTel: tel,username: name },
                      { where: { 'userId' :iduser} }

                  ).then(function() {
        
        response = {
            'statutCode' : 200, // success
            'succe': 'Compte modifie'        
        }
        callback(response);
        
    }).catch(function(err) {
        console.log(err)
        response = {
            
            'statutCode' : 500, // success
            'error': 'erreur dans l\'execution de la requete'          
        }
        callback(response)
        
           });
           
    


    

}

return {listBanque,listBanquiers,listVirementEx,updateProfil};
}




