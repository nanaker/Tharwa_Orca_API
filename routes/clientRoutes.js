module.exports = function(express,tokenController,accountController,clientController){
   
    const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------*/   

/*----------------------------- Service pour récupérer les informations d'un client'--------------------------------*/

/*-----------------------------------------------------------------------------------------------------------------------*/
router.get('/info',(req,res) =>{
    console.log('info');
    const token = req.headers['token']; //récupérer le Access token
       
          // const token ='v2RarW2ynm4wy1tjH4evI5zIor4LLNcA6MHT7faUOjm9ljOyytFBlgda9puzvpYp4J4hfqHTa5aUbSIdcfmF13fX6hsOeHQz1oueUCnNldSpZmXhlHlzZkevHsEF1QgH3tpTNFt7osXeg14A0Q5tv2h5P2qxZYrWOgURaKLrWmtjFDuPULBLFzVppuEdZNMh17RdXLSBXeWFqlIl0o2ly8gNg1IfaKrPlloq6I87s9X9AQ6g6SfPxX8ftvGQB3J';
        tokenController(token, function(OauthResponse){
            if (OauthResponse.statutCode == 200){
                clientController.getClientInfo(OauthResponse.userId,(response)=>{
                   if(response.statutCode == 200){
                        Nom = response.Nom;
                        Prenom = response.Prenom;
                        Fonction = response.Fonction;
                        Type = response.Type;
                        accountController.getClientAccounts(OauthResponse.userId,(response2)=>{
                            if (response2.statutCode == 200){

                                if (response2.nbComptes == 1){
                                    nbCompte = 1;
                                    NumCompte1 = response2.NumCompte1;
                                    EtatCompte1 = response2.EtatCompte1;
                                    BalanceCompte1 = response2.BalanceCompte1;
                                    res.status(200).json({'Nom': Nom,
                                                          'Prenom' : Prenom,
                                                         'Fonction': Fonction,
                                                          'Type' : Type,
                                                         'nbCompte' : nbCompte,
                                                         'NumCompte1' : NumCompte1,
                                                         'EtatCompte1' : EtatCompte1,
                                                         'BalanceCompte1' : BalanceCompte1});
                                }else if (response2.nbComptes == 2){
                                    nbCompte = 2;
                                    NumCompte1 = response2.NumCompte1;
                                    EtatCompte1 = response2.EtatCompte1;
                                    BalanceCompte1 = response2.BalanceCompte1;
                                    NumCompte2 = response2.NumCompte2;
                                    EtatCompte2 = response2.EtatCompte2;
                                    BalanceCompte2 = response2.BalanceCompte2;
                                    res.status(200).json({'Nom': Nom,
                                                          'Prenom' : Prenom,
                                                         'Fonction': Fonction,
                                                          'Type' : Type,
                                                         'nbCompte' : nbCompte,
                                                         'NumCompte1' : NumCompte1,
                                                         'EtatCompte1' : EtatCompte1,
                                                         'BalanceCompte1' : BalanceCompte1,
                                                         'NumCompte2' : NumCompte2,
                                                         'EtatCompte2' : EtatCompte2,
                                                         'BalanceCompte2' : BalanceCompte2});

                                }else if (response2.nbComptes == 3){
                                    nbCompte = 3;
                                    NumCompte1 = response2.NumCompte1;
                                    EtatCompte1 = response2.EtatCompte1;
                                    BalanceCompte1 = response2.BalanceCompte1;
                                    NumCompte2 = response2.NumCompte2;
                                    EtatCompte2 = response2.EtatCompte2;
                                    BalanceCompte2 = response2.BalanceCompte2;
                                    NumCompte3 = response2.NumCompte3;
                                    EtatCompte3 = response2.EtatCompte3;
                                    BalanceCompte3 = response2.BalanceCompte3;
                                    res.status(200).json({'Nom': Nom,
                                                          'Prenom' : Prenom,
                                                         'Fonction': Fonction,
                                                          'Type' : Type,
                                                         'nbCompte' : nbCompte,
                                                         'NumCompte1' : NumCompte1,
                                                         'EtatCompte1' : EtatCompte1,
                                                         'BalanceCompte1' : BalanceCompte1,
                                                         'NumCompte2' : NumCompte2,
                                                         'EtatCompte2' : EtatCompte2,
                                                         'BalanceCompte2' : BalanceCompte2,
                                                         'NumCompte3' : NumCompte3,
                                                         'EtatCompte3' : EtatCompte3,
                                                         'BalanceCompte3' : BalanceCompte3});

                                }else if (response2.nbComptes == 4){
                                    nbCompte = 4;
                                    NumCompte1 = response2.NumCompte1;
                                    EtatCompte1 = response2.EtatCompte1;
                                    BalanceCompte1 = response2.BalanceCompte1;
                                    NumCompte2 = response2.NumCompte2;
                                    EtatCompte2 = response2.EtatCompte2;
                                    BalanceCompte2 = response2.BalanceCompte2;
                                    NumCompte3 = response2.NumCompte3;
                                    EtatCompte3 = response2.EtatCompte3;
                                    BalanceCompte3 = response2.BalanceCompte3;
                                    NumCompte4 = response2.NumCompte4;
                                    EtatCompte4 = response2.EtatCompte4;
                                    BalanceCompte4 = response2.BalanceCompte4;
                                    res.status(200).json({'Nom': Nom,
                                                          'Prenom' : Prenom,
                                                         'Fonction': Fonction,
                                                          'Type' : Type,
                                                         'nbCompte' : nbCompte,
                                                         'NumCompte1' : NumCompte1,
                                                         'EtatCompte1' : EtatCompte1,
                                                         'BalanceCompte1' : BalanceCompte1,
                                                         'NumCompte2' : NumCompte2,
                                                         'EtatCompte2' : EtatCompte2,
                                                         'BalanceCompte2' : BalanceCompte2,
                                                         'NumCompte3' : NumCompte3,
                                                         'EtatCompte3' : EtatCompte3,
                                                         'BalanceCompte3' : BalanceCompte3,
                                                         'NumCompte4' : NumCompte4,
                                                         'EtatCompte4' : EtatCompte4,
                                                         'BalanceCompte4' : BalanceCompte4});

                                }

                            }else{
                                res.status(response2.statutCode).json({'error': response2.error});
                            }

                        });
                   } else {
                    res.status(response.statutCode).json({'error': response.error}); 
                   }
                   
                });
            }else {
                res.status(OauthResponse.statutCode).json({'error': OauthResponse.error});
            }
        });


});

    //exports :
   return router;

}