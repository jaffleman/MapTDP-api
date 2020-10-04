let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let texteFunction = require('./founction_script/gestionTexte')
//const jsonfile = require('jsonfile')
//let fs = require('fs'); 


//Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//Routes
app.get('/datas', (request, response)=>{
    
    const responseObj = {
        status:0,
        msg:'',
        value:{}
    }
    
    console.log('server.js: reception des données')
    if (request.query.arg === '') {
        responseObj.status = 100
        responseObj.msg = "NO DATA: Aucune donnée dans le presse-papier! Veuillez copier votre liste de TDP."
    }else{      
        let lesTdp = texteFunction.process(request.query.arg)
        if (lesTdp === null) {
            responseObj.status = 200;
            responseObj.msg = "NO TDP: Aucun TDP n'a été trouver! Veuillez copier votre liste de TDP."
        }else{
            console.log('server.js: lancement du traitement des données...')
            lesTdp = texteFunction.traitement(lesTdp)
            responseObj.status  = 300;
            responseObj.msg = 'OK'  
            responseObj.value = lesTdp
            console.log(responseObj)
        }       
    }
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.json(responseObj)
})
   
app.listen(8081) 