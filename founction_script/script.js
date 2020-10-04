
import { 
    traitement,
    afficheElementRep,
    afficheElementSalle,
    afficheElementRco,
    afficheElementTdp
} from './functions.js';
import { gereTexLa } from './gestionTexte.js';


 const run = () => {
   let tabTdp = gereTexLa((document.getElementById("msg").value));
    if (tabTdp.length === 0) {
        alert('Aucun TDP trouvé!');
    }else{
        tabTdp = traitement(tabTdp);        
        document.querySelector('.insertTexte').style.display = 'none';
        document.querySelector('.ajoutTexte').style.display = 'flex';
        afficheElementRep(tabTdp);
        afficheElementSalle(tabTdp);
        afficheElementRco(tabTdp);
        afficheElementTdp(tabTdp);
        show('.tdp','p.tdpElem');
    }
 }
 
document.querySelector('.startBouton').addEventListener('click',run());


        