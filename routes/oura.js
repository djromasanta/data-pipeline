const express = require('express');
const router = express.Router();

const request = require('request');
const api_config = require('../api_keys.json');

//Data Processor Controller
const Data_Proc = require('../controller/data_processor');
const data_processor = new Data_Proc();

//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource(); 


//Oura Client
var oura = require('oura');

var accessToken = 'BUBL74NYVIRNCIT7TFBW5PQBDAQA7KCQ';

let start = utilities.getSecondPreviousDate();
let end = utilities.getPreviousDate();


router.get('/sleep', function(req, res) {
    var apiDetails = utilities.getApiInfo(api_config, "Oura");
    var client = new oura.Client(apiDetails.api_key);

    client.sleep(start, end).then(function (sleep) {
        res.send(sleep);

        if(sleep["sleep"].length > 0){
          var processed_data = data_processor.ouraSleepRate(sleep["sleep"], start);
        }
        
    }).catch(function(error){
        console.error(error)
        
    })

});


module.exports = router;



// client.personalInfo().then(function (user) {
    //     console.log(JSON.stringify(user, null, 1))

    //     res.send({
    //         "status": 200,
    //         "result": user
    //     });

    // }).catch(function(error){
    //     console.error(error)
    // });