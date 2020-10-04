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
        let tabTdpError = [];
        let tabRepError = [];
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
            const {rep,repHasfouded} = (f.checheRepLa(texla, MatchPositionTab, a));
            const Tdp = String(texla.substring(MatchPositionTab[a], (MatchPositionTab[a]) + 10));
            const reglette = Tdp.slice(0, 7);
            const posission = Tdp.slice(7, 11);
            const magik = f.tabDesPositions()[parseInt(posission)];
            let salle, rco, colone, posissionReglette, opt;
            if (repHasfouded) {
                const tabInfoRep = f.calcPositionReglette(reglette, rep);
                if (tabInfoRep !== undefined) {
                    salle = tabInfoRep[0];
                    rco = tabInfoRep[1];
                    colone = tabInfoRep[2];
                    posissionReglette = tabInfoRep[3];
                    opt = tabInfoRep[4]?tabInfoRep[4]:"OK";
                    if (tabTdp.length === 0) {
                        tabTdp.push(new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
                    }
                    else {
                        tabTdp = f.tabCompare(tabTdp, new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
                    }
                }
                else {

                    //"position introuvable"
                    rco = '...';
                    salle = '...';
                    colone = '...';
                    posissionReglette = '...';
                    opt = '...'
                    if (tabTdpError.length === 0) {
                        tabTdpError.push(new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
                    }
                    else {
                        tabTdpError = f.tabCompare(tabTdpError, new Tdpla((a + 1), rep, reglette, posission, salle, magik, rco, colone, posissionReglette, opt));
                    }
                }
            }
            else {
                //"Répartiteur Introuvable"
                const allreadyExist = tabRepError.indexOf(rep)==-1?true:false;
                if (allreadyExist) {tabRepError.push(rep)}  
            }

        }
        
        return {tabTdp, tabTdpError, tabRepError}
         
    },
    /*************************************** */
    traitement: (tab) => {
        /*traitement() se charge d'ordonner la liste de TDP dans la tab.
        ils sont classés par Rep, par Salle, par Rco.*/
        const tabRep = f.repSearch(tab);
        const tabTrie = f.trieTdpXrep(tab,tabRep);
        const tabSalle = f.seachSalleXrep(tabTrie,tabRep);
        return f.shortTdpRepSalle(tabTrie,tabSalle,tabRep);
    },

    tdpCorrection: (data) => {
        const jsonfile = require('jsonfile')
        const {newPosition,oldPosition} = data;
        const {rep, posissionReglette, salle, rco, colone, reglette} = newPosition;
        const reppath = './founction_script/rep/'+rep+'.json'
        const checkRep=()=>{
            try {
                fs.statSync(reppath);
                return true;
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    return false;
                } 
            }
        }

        if (checkRep) {
            let repTab = jsonfile.readFileSync(reppath)
            if(repTab.tab[salle-1][rco-1][colone-1][posissionReglette-1][0] !== reglette){
                        repTab.tab[salle-1][rco-1][colone-1][posissionReglette-1][0] = reglette
                        if (oldPosition){
                            const {oldPosissionReglette, oldSalle, oldRco, oldColone} = oldPosition;
                            repTab.tab[oldSalle-1][oldRco-1][oldColone-1][oldPosissionReglette-1][0] = "x"
                        }  
                        jsonfile.writeFileSync(reppath, repTab)

                        console.log('Fichier écrassé!')
                        return "false"                
            }else{
                console.log('modif inutile');
                return "true" 
            }               
        }
        
    }
}     