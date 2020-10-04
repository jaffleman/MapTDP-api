let rep = require('./rep94')
let fs = require('fs')
const jsonfile = require('jsonfile')

module.exports = {

    ajouter: () => {
        document.querySelector('.insertTexte').style.display ='block';
        document.querySelector('.ajoutTexte').style.display ='none';
    },
    
    
    repSearch: (tab) => {
        //recherche des rep
        const tabRep=[];
        let repMatch=false;
        for (let i = 0; i < tab.length; i++) {
            if (tabRep.length===0) {
                tabRep.push(tab[i].rep);
            }else{
                for (let index = 0; index<tabRep.length; index++){
                    if (tabRep[index]===tab[i].rep) {
                        repMatch=true; break;
                    }
                }
                if (repMatch) {
                    repMatch=false;
                }else{
                    tabRep.push(tab[i].rep);
                }
            }
        }  
        
        return tabRep;  
    },
    
    
    trieTdpXrep: (tab,tab2) => {// tab = tableau de tdp, tab2= tableau de Rep
        let tabTrie= [];
        for (let i = 0; i < tab2.length; i++) {
            for (let y = 0; y < tab.length; y++) {
                if (tab2[i]==tab[y].rep) {
                    tabTrie.push(tab[y]);
                }
            } 
        }
        return tabTrie; 
    },
    
    
    seachSalleXrep: (tab,tab2) => {//tab = tab de Tdp trié, tab2 = tab de rep
        const tabSalle = []; 
        let salleMatch = false;  
        for (let a = 0; a < tab2.length; a++) {
            const tabS =[];
            for (let b = 0; b < tab.length; b++) {
                if (tab2[a]===tab[b].rep) {
                    if (tabS.length===0) {
                        tabS.push(tab[b].salle);
                    }else{
                        for (let index = 0; index<tabS.length; index++){
                            if (tabS[index]===tab[b].salle) {
                                salleMatch = true; break;
                            }
                        }
                        if (salleMatch) {
                            salleMatch = false;
                        }else{
                            tabS.push(tab[b].salle);
                        }
                    }    
                }        
            }
            tabSalle.push(tabS);            
        } 
        
        return tabSalle;
    },
    
    
    shortTdpRepSalle: (tab,tab2,tab3)=> {// tab3 = tab de rep, tab2 = tab de salle, tab = tab de Tdp trié
        //trie des tdp par rep puis par salle
        const newTab=[];
        for (let d = 0; d < tab3.length; d++) {
            for (let f = 0; f < tab2[d].length; f++) { 
                for (let g = 1; g < 3; g++) {
                     for (let e = 0; e < tab.length; e++) {
                        if (tab[e].rep===tab3[d]){
                            if (tab[e].salle===(f+1)) {
                                if (tab[e].rco===g) {
                                    newTab.push(tab[e]);
                                }
                            }                    
                        }
                    }   
                    
                }
           
            }    
        } 
        return newTab;
    },
    
    /***************************************** */
    
    //la fonction retourne un tableau de tdp sans doublons .
    tabCompare: (tab1,elem) => {
        let i=true;
        while (i) {
            for (let a = 0; a < tab1.length; a++) {
                if (tab1[a].rep==elem.rep) {
                    if (tab1[a].reglette==elem.reglette) {
                        if (tab1[a].posission==elem.posission) {
                           i=false;
                            break; 
                        }
                        
                    }
                }
                if ((a+1)==tab1.length) {
                        tab1.push(elem);
                        i=false;
                        break;
                    }
                
            }
        }
        return tab1;
    },
    
    twoDigit: (n) => {
        return (n < 10 ? '0' : '') + n
    },
    
    // création d'un tableau de coordonnée qui servira de référence pour la conversion de la position du TDP sur la reglette.
    //let tabPosissionReferens = [];//tableau des positions références pour la convertion des positions
    tabDesPositions: () => {
        let i = 0;//incrementeur de tabPosissionReferens
        const tab =[];
        for (let b = 1; b < 17; b++) {
            for (let a = 1; a < 9; a++) {
                tab[i]=[b,a];
                i++;
            }
        } 
        return tab;   
    },
    
    calcPositionReglette: (reglette,repName) => {
        
        const file = './founction_script/rep/'+repName+'.json'
        let repTab = []
        try {
            repTab = (jsonfile.readFileSync(file)).tab
        } catch (error) {
            
        }

        for (let salle = 0; salle < (repTab.length); salle++) {
            for (let rco = 0; rco < (repTab[salle].length); rco++) {
                for (let colone = 0; colone < (repTab[salle][rco].length); colone++) {
                    for (let position = 0; position < (repTab[salle][rco][colone].length); position++) {
                        if (repTab[salle][rco][colone][position].length>1) {
                            if (reglette == repTab[salle][rco][colone][position][0]) {
                                return  [(salle+1),(rco+1),(colone+1),(position+1),(repTab[salle][rco][colone][position][1])];
                            }
                        }else{
                            if (reglette == repTab[salle][rco][colone][position]) {
                                return  [(salle+1),(rco+1),(colone+1),(position+1),null];                            
                            }
                        }                                    
                    }
                }
            }
        }
    },
    
    checheRepLa: (texla,MatchPositionTab,a) => {
        const baieLa =  parseInt(texla.substring((MatchPositionTab[a])-3,(MatchPositionTab[a])-1)); 
        let r;
        if (baieLa>0){
            r =  texla.substring((MatchPositionTab[a])-9,(MatchPositionTab[a])-4);
        }else{
            r =  texla.substring((MatchPositionTab[a])-8,(MatchPositionTab[a])-3);
        }
        
        const reppath = './founction_script/rep/'+r+'.json'
        try {
            fs.statSync(reppath);
            return r;
        }
        catch (err) {
          if (err.code === 'ENOENT') {
            return 'rep??';
          }
        }
    }
}
