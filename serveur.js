let express = require('express')
let app = express()
let texteFunction = require('./founction_script/gestionTexte')
let myFileLog = require("./founction_script/writeLog.js") 
const { json, urlencoded } = require('body-parser')
const fs = require('fs');
//const { request } = require('http')
const jsonfile = require('jsonfile');
//const creator = require('./founction_script/repCreator')




//Middleware
app.use(urlencoded({extended: false}))
app.use(json())


//Routes
app.get('/getlog',(request, response)=>{
    console.log(myFileLog.time()+': demande de lecture log');
    if (request.query.arg === '*SuperJaffleman97160!*') {
        response.setHeader('Access-Control-Allow-Origin', '*')
        fs.readFile('./log.txt', (err, data) => {
            if (err) {
                throw err
            }else{
                response.end(data.toString()); 
            }
        })  
    }  
})

app.get('/tdpCorrection',(request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.end(texteFunction.tdpCorrection(JSON.parse(request.query.arg)).toString());       
})
app.get('/getrepstruct',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*')
    const h = myFileLog.time();
    const repName = request.query.arg;
    const folder = './founction_script/rep/'+repName.slice(-2);
    const file = folder+'/'+repName+'.json';
    const dataResponse = {
        repName,
        status:'nok',
        data:{"tab":[]},
        text:"Le répartiteur n'existe pas."
    }
    console.log(h+': demande de structure de répartiteur: '+repName);
    fs.stat(folder, 
    (err) => {
            if (err) {
                response.json(dataResponse)
                console.log(`Le répertoire: ${folder} n'existe pas.`);
            }else{
                console.log(`Le répertoir ${folder} existe!`);
                jsonfile.readFile(file,(err, data)=>{
                    if (!err) {
                        dataResponse.data.tab = data.tab;
                        dataResponse.status = 'ok';
                        dataResponse.text = "Rep chargé avec succes"
                        console.log('Le répartiteur '+repName+' existe!');
                        response.json(dataResponse);
                        console.log('données retournées');
                        response.end()
                    }else{
                        console.log('La lecture de '+repName+' a échouée!');
                    }
                })
            }
        }
    )
})
app.get('/CreatRep',(request,response)=>{
    let responseObj = {
        status:0,
        msg:'',
    }
    const h = myFileLog.time();
    const {repName, structure, peupler} = JSON.parse(request.query.arg);
    const folder = './founction_script/rep/'+repName.slice(-2);
    const file = folder+'/'+repName+'.json';
    console.log(h+': demande de création de répartiteur: '+repName);
    fs.stat(folder, 
    (err) => {
            if (err) {
                if (!peupler) {
                    console.log(`Le répertoire: ${folder} n'existe pas.`);
                    fs.mkdir(folder,{recursive:false}, (err)=>{
                        if (!err) {
                            console.log(`Le répertoire: ${folder} a été créé.`);
                            jsonfile.writeFile(file, structure,(err)=>{
                                if(!err){
                                    console.log('Le fichier: '+repName+'.json a été créé.',"process terminé...");
                                    response.setHeader("Content-Type", "text/plain")
                                    response.setHeader('Access-Control-Allow-Origin', '*')
                                    response.end('Le Repartiteur: '+repName+' a été créé avec succes.');
                                    //
                                }
                            }) 
                        }
                    })
                }
            }else{
                console.log(`Le répertoir ${folder} existe déjà!`);
                fs.stat(file,(err)=>{
                    if (!err) {
                        if (!peupler) {
                            responseObj.status = false;
                            responseObj.msg = 'Creation du rep impossible: le rep existe déjà!';
                            console.log('Le répartiteur '+repName+' existe déjà!',"process terminé...");
                            response.setHeader("Content-Type", "text/plain")
                            response.setHeader('Access-Control-Allow-Origin', '*')
                            response.json(responseObj)
                            response.end();
                        }else{
                            jsonfile.writeFile(file, structure, (err)=>{
                                if(!err){
                                    responseObj.status = true;
                                    responseObj.msg = 'Le Repartiteur: '+repName+' a été peupler avec succes.';
                                    console.log('Le fichier: '+repName+'.json a été peupler avec sucess.',"process terminé...");
                                    response.setHeader("Content-Type", "text/plain")
                                    response.setHeader('Access-Control-Allow-Origin', '*')
                                    response.json(responseObj)
                                    response.end();
                                    //
                                }
                            }) 
                        }
                        //
                    }else{
                        if (!peupler) {
                            jsonfile.writeFile(file, structure, (err)=>{
                                if(!err){
                                    responseObj.status = true;
                                    responseObj.msg = 'Le Repartiteur: '+repName+' a été créé avec succes.';
                                    console.log('Le fichier: '+repName+'.json a été créé.',"process terminé...");
                                    response.setHeader("Content-Type", "text/plain")
                                    response.setHeader('Access-Control-Allow-Origin', '*')
                                    response.json(responseObj)
                                    response.end();
                                    //
                                }
                            }) 
                        }
                    }
                })
            }
        }
    )


/*
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.end(creator.rep(JSON.parse(request.query.arg),h));    */
})
app.get('/datas', (request, response)=>{
    const h = myFileLog.time();    
    let responseObj = {
        status:0,
        msg:'',
        value:{},
        errorTab:[],
        errorRep:{}
    }
    
    console.log(h+': server.js: reception des données')
    if (request.query.arg === '') {
        responseObj.status = 100
        responseObj.msg = "NO DATA: Aucune donnée dans le presse-papier! Veuillez copier votre liste de TDP."
    }else{  
        const demande = request.query.arg
        const processReturn = texteFunction.process(demande)
        if (processReturn.tabTdp.length === 0 && processReturn.tabTdpError.length===0 && processReturn.tabRepError.length===0) {
            responseObj.status = 200;
            responseObj.msg = "NO TDP: Aucun TDP n'a été trouver! Veuillez copier votre liste de TDP."
            lesTdp = responseObj.msg;
        }else{
            console.log('server.js: lancement du traitement des données...')
            const traitementReturn = texteFunction.traitement(processReturn.tabTdp);
            responseObj = {
                status : 300,
                msg: 'OK',
                value : traitementReturn,
                errorRep : [...processReturn.tabRepError],
                errorTab : [...processReturn.tabTdpError],

            }
        } 
        myFileLog.log(h+'----------------------------------------------------'+'\n'+responseObj.status+" => [DEMANDE: "+demande+"] [REPONSE:"+ responseObj.msg+"]")  //Trace log de la demande    
    }
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.json(responseObj)
    console.log("process terminé");
})
   
app.listen(8081, () => {
    const h = myFileLog.time();
    console.log(h+"Serveur demarrer et en ecoute sur le port 8081");
    myFileLog.log(h+'== DEMARRAGE DU SERVEUR =>>'); //Trace log du demarrage
}) 