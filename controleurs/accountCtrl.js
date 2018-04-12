//imports
const datetime = require('node-datetime');
var tokenController = require('./tokenCtrl');


//exports
module.exports = function(Client,Compte,sequelize) {


/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------prodédure de création d'un compte bancaire courant---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
    
    function CreateCourantAccount(idClient,callback){

        //get current date and time 
        var dt = datetime.create();
        var formatted = dt.format('Y-m-dTH:M:S');
        var dateCreation = formatted ;

        //construire le numéro de compte

        sequelize.query('exec GetNextId').spread((results, metadata) => {
            
            var rows = JSON.parse(JSON.stringify(results[0]));
            var numSeq = rows.id;
            var middle = numSeq.toString();
            if (middle.length == 1){
                middle = '00000'+middle;
            }else if (middle.length == 2){
                middle = '0000'+middle;
            }else if (middle.length == 3){
                middle = '000'+middle;
            }else if (middle.length == 4){
                middle = '00'+middle;
            }else if (middle.length == 5){
                middle = '0'+middle;
            }

            var num = 'THW'+ middle + 'DZD';
            var balance = 0;
            var codeMonnaie = 'DZD';
            var idUser = idClient;
            var etat = 0;
            var typeCompte = 0;

            var newCompte = Compte.create({
                Num : num,
                Balance : balance,
                DateCreation : dateCreation,
                CodeMonnaie : codeMonnaie,
                IdUser : idUser,
                Etat :  etat,
                TypeCompte : typeCompte
    
            }).then(function(newCompte){
                response = {
                    'statutCode' : 201, // new ressource created
                    'NumCmpt': newCompte.Num      
                }
                callback(response);
                
            })
            .catch(err => {
                response = {
                    'statutCode' : 500, // new ressource created
                    'error':'Unable to add account'    
                }
                console.error('Unable to add account', err);
                callback(response);
                 
                 
            });


        });
     
    }

/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------prodédure de validation d'un compte banquire ---------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function validateAccount(numAccout,callback){
    Compte.findOne(
      {
        attributes:['Num','Etat'],
        where: {  'Num' : numAccout }
      }
    ).then(function(account){
    
        if (account){
            if(account.Etat == 0){
                account.update({
                    Etat: 1
                }).then(function() {
                    response = {
                        'statutCode' : 200, // compte validé
                    }
                    callback(response);
                    
                }).catch(err => {

                    console.log(err);
                    response = {
                        'statutCode' : 500, // erreur interne
                        'error':'Unable to validate account'
                    }
                    callback(response);
                });
            } else {
                response = {
                    'statutCode' : 400, //bad request
                    'error'  : 'account already active'           
                   }
                callback(response);
            }
        }
        else{
            response = {
                'statutCode' : 404, //not found
                'error'  : 'account not found'           
               }
            callback(response);
        }

    }).catch((err)=>{
        console.log(err);
        response = {
            'statutCode' : 500, // erreur interne
            'error':'Unable to validate account'
        }
        callback(response);
    });
}

/*-----------------------------------------------------------------------------------------------------------------------*/

/*-------------------------------récupérer les informations de tous les comptes d'un client ---------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/


function getClientAccounts(ClientId,callback){
        Client.hasMany(Compte, {foreignKey: 'IdUser'})
        Compte.belongsTo(Client, {foreignKey: 'IdUser'})
        Compte.findAll({

            attributes:['Num','Etat','Balance'],
            where: { 'IdUser' : ClientId} 
            
        })
        .then((Comptes) => { 
            
                //res.status(200).json({'Comptes': Comptes});
                response ={
                    'statutCode' : 200,
                    'Comptes' : Comptes
                }
                callback(response)
            
        }).catch(err => {
           // res.status(404).json({'error': 'erreur dans l\'execution de la requete'})
            response ={
                'statutCode' : 500,
                'error' : 'cant verify accounts'
            }
            callback(response)
        });
}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour extraire les comptes non validés------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function getCompteNonValide(callback){
           // faire une jointure entre la table client et la table Compte pour recuperer les infos du client et du compte non validé
            Client.hasMany(Compte, {foreignKey: 'IdUser'})
            Compte.belongsTo(Client, {foreignKey: 'IdUser'})
            Compte.findAll({

                include: [{
                    model: Client,
                    required: true
                   }],
                where:{'Etat' :0, 
                } ,
               })
            .then((Comptes) => { 
                response = {
                    'statutCode' : 200, // success
                    'Comptes': Comptes          
                }
                callback(response);     
                
              }).catch(err => {
              response = {
                'statutCode' : 500, // success
                'error': 'erreur dans l\'execution de la requete'          
            }
            callback(response) });

        
   
}



//exports :
return {CreateCourantAccount,validateAccount,getClientAccounts,getCompteNonValide};

}