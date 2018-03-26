//imports
var crypto = require('crypto');
var http = require("http");
const request = require('request');
var tokenVerifier = require('./tokenCtrl');
var conversion = require('./fctCtrl');
var async = require('async-if-else')(require('async'));
//var async = require('async-if-else');
//Routes
module.exports = function(Virement,Compte,sequelize,Client) {
    

//Envois vers un client Tharwa
function Tranfer_ClientTH(req, res){

    const token = req.headers['token']; //récupérer le Access token
    var montant=req.body.Montant;
    var Type = req.body.Type;
    var dest=req.body.CompteDestinataire;
    var source=req.body.CompteEmmetteur;

    console.log("le montant est:"+montant+"dest est:"+dest+"source est:"+source);

//Verification de non null
    if(montant == null || dest == null || source == null || Type == null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
    tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification      
    if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
            console.log("Un petit test par contre :"+dest);
            Compte.findOne({
                attributes:['Num'],
                where:{'Num' :dest} })
                .then(function(CompteFound){
                    if(CompteFound){
                    console.log("Le compte existe bien");
                        if(montant>200000){
                            // Fournir un justificatif
                        }else //Effectuer le virement avec la commission
                        {

                        }
                    }
                    else{
                        return res.status(400).json({'error':'Le compte de destination n\'existe pas'});
                    }

            })
            .catch(function(err){
                return res.status(500).json({'error':'Je ne sais pas'}); //interne error
                console.log(err);
            });


}
else {
    //si le access token n'est pas valide ou une erreur interne au serveur d'authentification s'est produite:
    res.status(response.statutCode).json({'error': response.error});
}

});
}

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement entre les comptes du client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function Virement_local(req, res){

    const token = req.headers['token']; //récupérer le Access token
    console.log("token= "+req.headers.authorization.substring(7));
    // recuperer les parametres 
    var Montant=req.body.montant;
    var Type1 = req.body.type1;
    var Type2=req.body.type2;
    var Motif=req.body.motif;
    var emmeteur ={};
    var destinataire ={};
    var nom={};
    var iduser={};
    var idcom={};
    
    
    

//Verification de non null
    if(Montant == null || Type1 == null || Type2== null || Motif == null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
    async.series({

        User(callback) { // recupere l'utilisateur à partir de l'acess token
            tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification      
            if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
                   
                    iduser= response.userId;
                    callback();
            }
            else callback(res.status(response.statutCode).json({'error': response.error}));
        });
           
            
        },
        CompteEmmeteur(callback){ // recuperer le compte emmeteur
                  
               
               Compte.findOne({
                attributes:['Num','Balance'],
                where:{'IdUser' :id, 
                'TypeCompte': Type1} })
            .then((Compte1) => {
                emmeteur=Compte1.Num;
                if (Compte1.Balance<Montant){ // verifier si le montant à virer ne depasse pas la balance du compte
                    callback(res.status(403).json({'error': 'Balance insuffisante'}))
                }
                else callback();
              }).catch(err => callback(res.status(404).json({'error': 'Compte emmeteur non existant'})));
        },
        CompteRecepteur(callback){ // recupere le compte du destinataire 
           
         
         Compte.findOne({
          attributes:['Num'],
          where:{'IdUser' :id, 
          'TypeCompte': Type2} })
      .then((Compte2) => {
          destinataire=Compte2.Num;
          callback();
        }).catch(err => callback(res.status(404).json({'error': 'Compte destinataire non existant'})));
  },
     Nom(callback){ // recuperer le nom du client
    
            Client.findOne({
            attributes:['Nom','Prenom'],
            where:{'IdUser' :id} })
          
                 .then((User) => {
                 Nom=User.Nom+' '+User.Prenom;;
                callback();
            }).catch(err => callback(res.status(404).json({'error': 'Utilisateur non existant'})));
             }
             ,
             idcommission(callback){ // recupere l'id de commission generer par le virement 
                sequelize.query('exec get_next_idcommission').spread((results, metadata) => {
           
                    var rows = JSON.parse(JSON.stringify(results[0]));
                    idcom = parseInt(rows.id);
                    console.log(idcom);
                    callback();
                });
                
             },
             function (callback){ 
                 // execution des virement
                 if ((Type1=='0')&&(Type2=='2')){ // virement du courant vers devise euro
                conversion(Montant,0,function(resultat){ //conversion du montant vers l'euro
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:resultat,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom
                                   }
                            }).then((response) => {
                                callback( res.status(200).json({'succe':'Virement effectué avec succe'}));
                            
                         }).catch(err => callback(res.status(401).json({'error': 'Virement non effectue'}))); 
                });
            }
            else {
               if ((Type1=='0')&&(Type2=='3')){  // virement du courant vers devise dollar
                conversion(Montant,1,function(resultat){
                    sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:resultat,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom
                                   }
                        }).then((response) => {
                            callback( res.status(200).json({'succe':'Virement effectué avec succe'}));
                        
                     }).catch(err => callback(res.status(401).json({'error': 'Virement non effectue'}))); 
                    });
               }
               else {
                   if ((Type2=='0')&&(Type1=='2')){ // virement du devise euro vers courant
                    conversion(Montant,2,function(resultat){
                        sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
                        {
                              bind: {
                                     montant: Montant,
                                     montant2:resultat,
                                    emmeteur: emmeteur,
                                    recepteur : destinataire,
                                    motif : Motif,
                                    nom: Nom,
                                    type1:Type1,
                                    type2:Type2,
                                    id:idcom
                                       }
                            }).then((response) => {
                                callback( res.status(200).json({'succe':'Virement effectué avec succe'}));
                            
                         }).catch(err => callback(res.status(401).json({'error': 'Virement non effectue'}))); 
                        });
                   }
                   else {
                       if ((Type2=='0')&&(Type1=='3')){ // virement du devise dollar vers courant
                        conversion(Montant,3,function(resultat){
                            sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
                            {
                                  bind: {
                                         montant: Montant,
                                         montant2:resultat,
                                        emmeteur: emmeteur,
                                        recepteur : destinataire,
                                        motif : Motif,
                                        nom: Nom,
                                        type1:Type1,
                                        type2:Type2,
                                        id:idcom
                                           }
                                }).then((response) => {
                                    callback( res.status(200).json({'succe':'Virement effectué avec succe'}));
                                
                             }).catch(err => callback(res.status(401).json({'error': 'Virement non effectue'}))); 
                            });
                       }
                       else {
                           // virement entre le compte courant et epargne
                        sequelize.query('exec Virement_local $montant,$montant2,$emmeteur,$recepteur,$motif,$nom,null,null,$type1,$type2,$id',
                    {
                          bind: {
                                 montant: Montant,
                                 montant2:0,
                                emmeteur: emmeteur,
                                recepteur : destinataire,
                                motif : Motif,
                                nom: Nom,
                                type1:Type1,
                                type2:Type2,
                                id:idcom
                                   }
                                }).then((response) => {
                                    callback( res.status(200).json({'succe':'Virement effectué avec succe'}));
                                
                             }).catch(err => callback(res.status(401).json({'error': 'Virement non effectue'}))); 
                   
                       }
                   }
                
               }
                    
            }
             }

            

    });
    
}

return {Tranfer_ClientTH,Virement_local};
}




