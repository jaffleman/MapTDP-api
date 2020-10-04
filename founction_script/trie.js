function trie(tab) {
    var tabRep;
    var i=0;
    do {
        if ((tab2.length===undefined)||(tabRep[i-1]!==tab[i].rep)) {
            tabRep.push(tab[i].rep);
            i++;  
        }
        
    } while (i<tab.length);
    console.log(tabRep)
}