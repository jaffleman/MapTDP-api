class Tdpla {
    constructor(nd,rep,reglette,posission,salle,magik,rco,colone,posissionReglette,opt){
        this.nd = parseInt(nd);
        this.rep = String(rep);
        this.reglette = reglette;
        this.posission = posission;
        this.salle = salle;
        this.magik = magik;
        this.rco = rco;
        this.colone = colone;
        this.posissionReglette = posissionReglette;
        this.opt = opt;
    }
}


let f = require('./functions')
 
module.exports = {
    process : (texla) => {
        /* process() extrait une liste d'objet de type TDP créé a l'aide de la classe tdp.
        cette liste est obtenue a partir du texte brute */
        let z = 0;
        let x = 0;
        let y = 0;
        let match = 0;
        let tabTdp = [];
        const MatchPositionTab = []; //tab des positions correspondantes a un mot clé trouvé
        const tabATexla = texla.split(''); //division du text lettre par lettre, placée dans un tab
        const tabMotCle = [['L', '/', 'I', 'N', 'X'],
        ['R', '/', 'D', 'E', 'G'],
        ['A', '/', 'T', 'E', 'L'],
        ['T', '/', 'L', 'I', 'F']];
        for (let a = 0; a < tabATexla.length; a++) {
            let continie = true;
            x = a;
            while (continie) {
                if (tabATexla[x] === tabMotCle[y][z]) {
                    x++;
                    z++;
                    match++;
                    if (match > 4) {
                        match = 0;
                        MatchPositionTab.push(a);
                        continie = false;
                    }
                }
                else {
                    x = a;
                    z = 0;
                    y++;
                    match = 0;
                    if (y > 3) {
                        y = 0;
                        continie = false;
                    }
                }
            }
        }
        for (let a = 0; a < MatchPositionTab.length; a++) {
            const rep = (f.checheRepLa(texla, MatchPositionTab, a));
            const Tdp = String(texla.substring(MatchPositionTab[a], (MatchPositionTab[a]) + 10));
            const reglette = Tdp.slice(0, 7);
            const posission = Tdp.slice(7, 11);
            const magik = f.tabDesPositions()[parseInt(posission)];
            let salle, rco, colone, posissionReglette, opt;
            const tabInfoRep = f.calcPositionReglette(reglette, rep);
            if (rep != 'REP??') {
                //const tabInfoRep = calcPositionReglette(reglette,rep);
                if (tabInfoRep !== undefined) {
                    opt = tabInfoRep[4];
                    if (tabInfoRep[4] === 'I') {
                        opt = 'INVERSEE';
                    }
                    else {
                        if (tabInfoRep[4] === 'TNI') {
                            opt = 'NON ISOLABLE';
                        }
                        else {
                            opt = null;
                        }
                    }
                    try {
                        rco = tabInfoRep[1];
                    }
                    catch (error) {
                        rco = '1';
                    }
                    try {
                        salle = tabInfoRep[0];
                    }
                    catch (error) {
                        salle = '1';
                    }
                    try {
                        colone = tabInfoRep[2];
                    }
                    catch (error) {
                        colone = '...';
                    }
                    try {
                        posissionReglette = tabInfoRep[3];
                    }
                    catch (error) {
                        posissionReglette = '...';
                    }
                }
                else {
                    // tabInfoRep = calcPositionReglette(reglette,rep);
                    rco = '1';
                    salle = '1';
                    colone = 'Position';
                    posissionReglette = 'Inconnue';
                }
            }
            else {
                //let tabInfoRep = calcPositionReglette(reglette,rep);
                rco = 1;
                salle = 1;
                colone = 'Position';
                posissionReglette = 'Inconnue';
                opt = 'REP INCONNU';
            }
            if (tabTdp.length === 0) {
                tabTdp.push(new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
            }
            else {
                tabTdp = f.tabCompare(tabTdp, new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
            }
        }
        if (tabTdp.length === 0) {return null;} else {return tabTdp;}
        
    } 
    
    ,
  
    /*************************************** */
    
    traitement: (tab) => {
        /*traitement() se charge d'ordonner la liste de TDP dans la tab.
        ils sont classés par Rep, par Salle, par Rco.*/
        const tabRep = f.repSearch(tab);
        const tabTrie = f.trieTdpXrep(tab,tabRep);
        const tabSalle = f.seachSalleXrep(tabTrie,tabRep);
        return f.shortTdpRepSalle(tabTrie,tabSalle,tabRep);
        
    }
}         

