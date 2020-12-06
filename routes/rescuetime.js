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


//Rescue Time Client
router.get('/analytics', function(req, res) {
    var apiDetails = utilities.getApiInfo(api_config, "RescueTime");
    var apiEndpoint = apiDetails.api_endpoints[0]+"?";
    var apiKey = "key="+apiDetails.api_key;
    var apiDate = "&"+apiDetails.api_date_param[0]+"="+utilities.getPreviousDate()+"&"+apiDetails.api_date_param[1]+"="+utilities.getPreviousDate();


    request(apiEndpoint+apiKey+apiDate, { json: true }, function (err, response, body) {
        if (err) { return console.log(err); }
        
        if(body.rows.length > 0){
            var processed_data = data_processor.rescueTimeAnalytics(body.rows, utilities.getPreviousDate());
        }
        
        res.send({
            "status": 200,
            "result": body
        });
    });

});


router.get('/daily_summary', function(req, res) {
    var apiDetails = utilities.getApiInfo(api_config, "RescueTime");
    var apiEndpoint = apiDetails.api_endpoints[1]+"?";
    var apiKey = "key="+apiDetails.api_key;
    var apiDate = "&"+apiDetails.api_date_param[1]+"="+utilities.getPreviousDate()+"&"+apiDetails.api_date_param[1]+"="+utilities.getPreviousDate();


    request(apiEndpoint+apiKey+apiDate, { json: true }, function (err, response, body) {
        if (err) { return console.log(err); }
        
        //console.log(Object.entries(body[0]));
        //console.log("heeere", body[0]);
        if(body.length > 0){
            var processed_data = data_processor.rescueTimeDailySummary(body, utilities.getPreviousDate());
        }

        res.send({
            "status": 200,
            "result": body
        });
    });

});


module.exports = router;