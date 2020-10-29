const fs = require('fs');
const jsonfile = require('jsonfile');


module.exports.rep = ({repName, structure},h)=>{
    const folder = './founction_script/rep/'+repName.slice(-2);
    const file = folder+'/'+repName+'.json';
    console.log(h+': demande de création de répartiteur: '+repName);
    const exist=(elem)=>{
        try {
            fs.statSync(elem);
            return true;
        }
        catch (err) {
            console.log(err);
                return false;
        }
    }
    function creatFile(){
        try {
            jsonfile.writeFileSync(file,structure);
            return true
        } 
        catch (error) {
            return false;
        }
    }
    function creatFolder(){
        try {
            fs.mkdirSync(folder)
            return true
        } 
        catch (error) {
            return false
        }
    }  
    if (exist(folder)) {
        console.log('folder exist');
        if (exist(file)) {
            console.log('file already exist');
            return 'nok:rep already exist'
        } else {
            console.log('file missing');
            if (creatFile()) {
                console.log('file created');
                return 'ok: rep created'
            } else {
                console.log('file creation abort');
                return 'nok:rep creation abort'
            }
        }
        
    } else {
        console.log('folder missing');
        if (creatFolder()) {
            console.log('folder created');
            if (creatFile()) {
                console.log('files created');
                return 'ok: rep created'
            } else {
                console.log('file cration abort');
                return 'nok: rep creation abort'
            }
        } else {
            console.log('folder creation abort');
            return 'nok:Folder creation abort'
        }
    }   
} /*
fs.stat(`./founction_script/rep/${folder}`, 
(err) => {
        if (err) {
            console.log(`Le répertoire: ${folder} n'existe pas.`);
            fs.mkdir(`./founction_script/rep/${folder}`,{recursive:false}, (err)=>{
                if (!err) {
                    console.log(`Le répertoire: ${folder} a été créé.`);
                    jsonfile.writeFile(`./founction_script/rep/${folder}/${repName}.json`, structure,(err)=>{
                        if(!err){
                            console.log('Le répartiteur: '+repName+'.json a été créé.',"process terminé...");
                            trace = 'OK';
                        }
                    }) 
                }
            })
        }else{
            console.log(`Le répertoir ${folder} existe déjà!`);
            fs.stat(`./founction_script/rep/${folder}/${repName}.json`,(err)=>{
                if (!err) {
                    console.log('Le répartiteur '+repName+' existe déjà!',"process terminé...");
                    trace = 'NOK';
                }else{
                    jsonfile.writeFile(`./founction_script/rep/${folder}/${repName}.json`, structure, (err)=>{
                        if(!err){
                            console.log('Le répartiteur: '+repName+'.json a été créé.',"process terminé...");
                        }
                    })   
                }
            })
        }
    }
) */