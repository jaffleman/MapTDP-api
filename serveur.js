let express = require('express')
let app = express()
let texteFunction = require('./founction_script/gestionTexte')
let myFileLog = require("./founction_script/writeLog.js") 
const { json, urlencoded } = require('body-parser')
const fs = require('fs');



//Middleware
app.use(urlencoded({extended: false}))
app.use(json())


//Routes
app.get('/getlog',(request, response)=>{
    console.log('demande de lecture log');
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

app.get('/datas', (request, response)=>{
    const h = myFileLog.time();    
    let responseObj = {
        status:0,
        msg:'',
        value:{},
        errorTab:[],
        errorRep:{}
    }
    
    console.log('server.js: reception des données')
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
    console.log("Serveur demarrer et en ecoute sur le port 8081");
    myFileLog.log(myFileLog.time()+'== DEMARRAGE DU SERVEUR =>>'); //Trace log du demarrage
}) 