var oxr = require('open-exchange-rates'),
    fx = require('money');
    
module.exports =  function  (Compte,Client,sequelize){
function GetCompte(iduser,Type1,callback){
    Compte.findOne({
        attributes:['Num','Balance'],
        where:{'IdUser' :iduser, 
        'TypeCompte': Type1} })
    .then((Compte1) => {
        
       callback(null,Compte1);
      }).catch(err => {
        callback(err,null);});
}
function GetUser(iduser,callback){
    Client.findOne({
       
        where:{'IdUser' :iduser} })    
    .then((User) => {
       callback(null,User);
      }).catch(err => {
        callback(err,null);});
}
function getNextIdComm(callback){
    
    sequelize.query('exec get_next_idcommission').spread((results, metadata) => {
           
        var rows = JSON.parse(JSON.stringify(results[0]));
        callback(parseInt(rows.id));
    });
}
function historique(iduser,callback){
    sequelize.query('exec historique $userid',
                    {
                          bind: {
                                 userid:iduser
                                }
                        }).then((historique) => {
                            
                            callback(null,JSON.parse(JSON.stringify(historique[0])) );
                        }).catch(err => {
                          callback(err,null);});
    
}

function conversion(montant,par,callback){
    var valeur;
    oxr.set({ app_id: 'a8a5c2a6302b453f9266c7254b043f6a' });
oxr.latest(function() {
    // Apply exchange rates and base rate to `fx` library object:
    
	fx.rates = oxr.rates;
	fx.base = oxr.base;
    
    switch (par)
    {
        case 0:   callback( fx(montant).from('DZD').to('EUR')); // courant vers devise euro
        break ;
        case 1: callback(fx(montant).from('DZD').to('USD')) // courant vers devise dollar
        
        break ;
        case 2:  callback(fx(montant).from('EUR').to('DZD')) //   devise euro vers courant 
       
        break ;
        case 3:   callback( fx(montant).from('USD').to('DZD')) //  devise dollar vers courant 
        break ;
        


    }
   
});
return valeur;
}

function VirCourDevis(par,Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    conversion(Montant,par,function(resultat){ //conversion du montant vers l'euro
    
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
                                call(null,res);   
                            }).catch(err => {
                                call(err,null);  
                            });
                });

}
function VirCourEpar(Montant,emmeteur,destinataire,Motif,Nom,Type1,Type2,idcom,call){
    
    
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
                                call(null,res);   
                            }).catch(err => {
                                
                                call(err,null);  
                            });
                

}
return {GetCompte,GetUser,getNextIdComm,VirCourDevis,VirCourEpar,historique}
}