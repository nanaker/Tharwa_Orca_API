var oxr = require('open-exchange-rates'),
	fx = require('money');

   
 module.exports =  function  (montant,par,callback){
     let valeur;
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






  

  

