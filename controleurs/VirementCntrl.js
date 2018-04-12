
//imports
var crypto = require('crypto');
var http = require("http");
const request = require('request');
var tokenVerifier = require('./tokenCtrl');
var conversion = require('./fctCtrl');
var async = require('async-if-else')(require('async'));
//var async = require('async-if-else');
//Routes
module.exports = function(Virement,Compte,User,Client,sequelize) {

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement vers un autre client THARWA----------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/

function TranferClientTH(req, res){


    var montant=req.body.Montant;
    var Justificatif = req.body.Justificatif;
    var dest=req.body.CompteDestinataire;//numero de compte de destinataire
    var Motif=req.body.Motif;


//Verification de non null
    if(montant == null || dest == null ||Motif==null){
        return res.status(400).json({'error':'missing parameters'}); //bad request
    }
  
    
   const token = req.headers['token']; //récupérer le Access token
  
   
    tokenVerifier(token, function(response){   //vérifier le access token auprès du serveur d'authentification      
    
    if (response.statutCode == 200){ //si le serveur d'authentification répond positivement (i.e: Access token valide)
            var id = response.userId; //recupérer le id de l'utilisateur
            const value = sequelize.escape(id);
            Compte.findOne({ // Vérification de lexistance du numero de compte destinataire
                attributes:['Num'],
                where:{'Num' :dest} })
                .then(function(CompteFound){
                    if(CompteFound){
                            Compte.findOne({//vérification de l'éxistance du numero de compte de lemetteur
                                attributes:['Num','Balance'],
                                where:{'IdUser' :id} })
                                .then(function(CompteFoundsent){
                                    if(CompteFoundsent){
                                        User.findOne({// recupération du nom de l'emmeteur après vérification de l'éxistance
                                            attributes:['username'],
                                            where:{'userId' :id} })
                                            .then(function(usersend){
                                                if(usersend){
                                                    Compte.findOne({// recupération de l'ID du récépteur après vérification de l'éxistance
                                                    attributes:['IdUser'],
                                                    where:{'Num' :dest} })
                                                    .then(function(IDreceiver){
                                                        if(IDreceiver){
                                                            User.findOne({// recupération de nom du récépteur après vérification de l'éxistance
                                                            attributes:['username'],
                                                            where:{'userId' :IDreceiver.IdUser} })
                                                            .then(function(Nomreceiver){
                                                                if(Nomreceiver){   
                                                                    if (montant<CompteFoundsent.Balance &&  dest.substr(0,3)=='THW'){
                                                                        sequelize.query('exec GetNextIdCommission').spread((results, metadata) => {
                                                                        var rows = JSON.parse(JSON.stringify(results[0]));
                                                                        idcom = parseInt(rows.id);
                                                                        console.log("Id de la commission "+idcom); 


                                                                        sequelize.query('exec GetPourcentageCommissionVirTH').spread((results, metadata) => {
                                                                        var rows = JSON.parse(JSON.stringify(results[0]));
                                                                        pourc = parseInt(rows.id);
                                                                        console.log("Le pourcentage de la commission "+pourc); 
                                                                            

                                                                        if(Justificatif==null){                                                                                                                                                                                                                             
                                                                            // Y a pas de justificatif à fournir dans la t ransaction sera validée directement
                                                                            sequelize.query('exec AddVirementClientTharwa $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur, null, $Statut, $NomDestinataire,$pourcentage,$commission',
                                                                            {
                                                                                bind: {
                                                                                        Montant: montant, 
                                                                                        CompteDestinataire: dest,   //Compte destination                                                                                                                                                                                                                      
                                                                                        CompteEmmetteur:CompteFoundsent.Num,    //Compte emetteur 
                                                                                        Motif:Motif,    //Motif d'envoi                                                               
                                                                                        NomEmetteur:usersend.username, //Nom emetteur
                                                                                        Statut:1,
                                                                                        NomDestinataire:Nomreceiver.username, // Nom recepteur
                                                                                        pourcentage:pourc,
                                                                                        commission:idcom
                                                                                     }
                                                                                     
                                                                            }).then((response) => {
                                                                                return( res.status(200).json({'succe':'Virement sans justificatif effectué avec succe'}));
                                                                            
                                                                             }).catch(err => {return(res.status(401).json({'error': 'Virement sans justificatif non effectue'}))});                                                                     
                                                                                                                                   
                                                                                                                                    
                                                                       }
                                                                        else{   
                                                                            var cmptdest=dest;
                                                                            var emetteur=CompteFoundsent.Num;
                                                                            sequelize.query('exec AddVirementClientTharwaEnAttente $Montant, $CompteDestinataire, $CompteEmmetteur, $Motif, $NomEmetteur,$justificatif, null,  $NomDestinataire,$pourcentage,$commission',
                                                                            {
                                                                                bind: {
                                                                                        CompteDestinataire: dest,   //Compte destination  
                                                                                        Montant: montant,
                                                                                        justificatif :Justificatif,                                                              
                                                                                        CompteEmmetteur:emetteur,    //Compte emetteur 
                                                                                        Motif:Motif,    //Motif d'envoi                                                               
                                                                                        NomEmetteur:usersend.username, //Nom emetteur
                                                                                        NomDestinataire:Nomreceiver.username ,// Nom recepteur
                                                                                        pourcentage:pourc,
                                                                                        commission:idcom
                                                                            }}).then((response) => {
                                                                                return( res.status(200).json({'succe':'Virement avec justificatif et notification effectué avec succe'}));
                                                                            
                                                                             }).catch(err => {return(res.status(401).json({'error': 'Virement avec justificatif et notification non effectue'}))});                                                                     
                                                                                                                                                 
                                                                         
                                                                        }
                                                                    })
                                                                    })
                                                                   
                                                                    } 
                                                                    else{
                                                                        return (res.status(403).json({'error': 'Balance insuffisante'}))
                                                                    }                                                           
                                                                    
                                                                }
                                                                else{ 
                                                                   return res.status(404).json({'error':'Le recepteur ne contient pas de nom lorsquil a etait enregistre'});
                                                                }
                                                            })
                                                            .catch(function(err){
                                                                //Si une erreur interne au serveur s'est produite :
                                                                 res.status(500).json({'error':'peut pas récuperer le nom du recepteur'}); 
                                                                 console.log(err);
                                                            });
                                                        }
                                                        else{ 
                                                           return res.status(404).json({'error':'le recepteur n a pas de mail'});
                                                        }   
        
                                                    })
                                                    .catch(function(err){
                                                        //Si une erreur interne au serveur s'est produite :
                                                         res.status(500).json({'error':'peut pas récuperer le mail du recepteur'}); 
                                                         console.log(err);
                                                    });

                                                }
                                                else{ console.log("Le nom de lemetteur inexistant");
                                                    return res.status(404).json({'error':'Le nom de lemetteur inexistant'});
                                                }
                                            })
                                            .catch(function(err){
                                                //Si une erreur interne au serveur s'est produite :
                                                 res.status(500).json({'error':'peut pas vérifier le nom de lemetteur'}); 
                                                 console.log(err);
                                            });
                                    
                                    }
                                    else{ console.log("Le compte de l\'emetteur inexistant");
                                        return res.status(404).json({'error':'Le compte de l\'emetteur inexistant'});
                                    }
                                })
                                .catch(function(err){
                                    //Si une erreur interne au serveur s'est produite :
                                     res.status(500).json({'error':'peut pas vérifier le numero de compte lemetteur'}); 
                                     console.log(err);
                                });
                                 
                    }
                    else{  console.log("Le compte de destination inexistant");
                        return res.status(404).json({'error':'Le compte de destination inexistant'});
                    }
            })
            .catch(function(err){ console.log("peut pas vérifier le numero de compte destination");
                return res.status(500).json({'error':'peut pas vérifier le numero de compte destination'}); //interne error
                console.log(err);
            });
}
})


return {TranferClientTH};
}
/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------------------Procedure pour effectue un virement entre les comptes du client------------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
function Virement_local(iduser,Montant,Type1,Type2,Motif,rep){
   
    var  emmeteur ={};
    var destinataire ={};
    var nom={};
    var idcom={};

    async.series({

        CompteEmmeteur(callback){ // recuperer le compte emmeteur
                  
               
               Compte.findOne({
                attributes:['Num','Balance'],
                where:{'IdUser' :id, 
                'TypeCompte': Type1} })
            .then((Compte1) => {
                emmeteur=Compte1.Num;
                if (Compte1.Balance<Montant){ // verifier si le montant à virer ne depasse pas la balance du compte
                    console.log('balance insuff');
                    response = {
                        'statutCode' : 403, // success
                        'error': 'Balance insuffisante'          
                    }
                    rep(response);
                                       
                    
                }
                else callback();
              }).catch(err => {
                response = {
                    'statutCode' : 404, // success
                    'error': 'Compte emmeteur non existant'          
                }
                rep(response);
               
                
            });
        },
        CompteRecepteur(callback){ // recupere le compte du destinataire 
           
         
         Compte.findOne({
          attributes:['Num'],
          where:{'IdUser' :id, 
          'TypeCompte': Type2} })
      .then((Compte2) => {
          destinataire=Compte2.Num;
          callback();
        }).catch(err => {
            response = {
                'statutCode' : 404, // success
                'error': 'Compte destinataire non existant'          
            }
            rep(response);
           
            
        });
  },
     Nom(callback){ // recuperer le nom du client
    
            Client.findOne({
            attributes:['Nom','Prenom'],
            where:{'IdUser' :id} })
          
                 .then((User) => {
                 Nom=User.Nom+' '+User.Prenom;;
                callback(); 
            }).catch(err => {
                response = {
                    'statutCode' : 404, // success
                    'error': 'Utilisateur non existant '          
                }
                rep(response);
                
            });
             }
             ,
             idcommission(callback){ // recupere l'id de commission generer par le virement 
                sequelize.query('exec get_next_idcommission').spread((results, metadata) => {
           
                    var rows = JSON.parse(JSON.stringify(results[0]));
                    idcom = parseInt(rows.id);
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
                            }).then((res) => {
                                response = {
                                    'statutCode' : 200, //succe
                                    'succe': 'Virement  effectue avec succe'          
                                }
                                rep(response);
                                
                            }).catch(err => {
                                response = {
                                    'statutCode' : 500, // error
                                    'error': 'Virement non effectue'          
                                }
                                rep(response);
                               
                                
                            });
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
                                }).then((res) => {
                                    response = {
                                        'statutCode' : 200, //succe
                                        'succe': 'Virement  effectue avec succe'          
                                    }
                                    rep(response);
                                    
                                }).catch(err => {
                                    response = {
                                        'statutCode' : 500, // error
                                        'error': 'Virement non effectue'          
                                    }
                                    rep(response);
                                  
                                    
                                });
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
                                    }).then((res) => {
                                        response = {
                                            'statutCode' : 200, //succe
                                            'succe': 'Virement  effectue avec succe'          
                                        }
                                        rep(response);
                                        
                                    }).catch(err => {
                                        response = {
                                            'statutCode' : 500, // error
                                            'error': 'Virement non effectue'          
                                        }
                                        rep(response);
                                        
                                        
                                    });
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
                                        }).then((res) => {
                                            response = {
                                                'statutCode' : 200, //succe
                                                'succe': 'Virement  effectue avec succe'          
                                            }
                                            rep(response);
                                          
                                        }).catch(err => {
                                            response = {
                                                'statutCode' : 500, // error
                                                'error': 'Virement non effectue'          
                                            }
                                            rep(response);
                                            
                                            
                                        });
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
                                }).then((res) => {
                                    response = {
                                        'statutCode' : 200, //succe
                                        'succe': 'Virement  effectue avec succe'          
                                    }
                                    rep(response);
                                    
                                }).catch(err => {
                                    response = {
                                        'statutCode' : 500, // error
                                        'error': 'Virement non effectue'          
                                    }
                                    rep(response);
                                    
                                    
                                });
                    
                }
                   }
                
               }
                    
            }
             }

            

    });
    
}

return {TranferClientTH,Virement_local};
}




