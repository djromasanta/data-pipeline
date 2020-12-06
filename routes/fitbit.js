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


// Fitbit Client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
    clientId: "22C34M",
    clientSecret: "c1e297257be3ddf33e8a4c03f837e175",
  apiVersion: '1.2'
});

//Client
// clientId: "22C34M",
// clientSecret: "c1e297257be3ddf33e8a4c03f837e175",


//Personal
// clientId: "22BZTD",
//   clientSecret: "802038298b4ffb063bda91217d6df550",

let token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJaVEQiLCJzdWIiOiI4V1Q0SkQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjAzNTg4OTc2LCJpYXQiOjE2MDM1NjAxNzZ9.aaMvxakMEh_Q_yPgE5vSDs9yE045iIHefLoMCxBzLl4
eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJaVEQiLCJzdWIiOiI4V1Q0SkQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjAzNTg5MDAxLCJpYXQiOjE2MDM1NjAyMDF9.1BxZdHoHaGn0F0YpYcC-mP2wbe8PmY2TlEjmRiQVH_k`;

// redirect the user to the Fitbit authorization page
router.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'https://ld-fitbit-api.herokuapp.com/main/fitbit/oauthcallback'));
});

router.get("/oauthcallback", (req, res) => {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'https://ld-fitbit-api.herokuapp.com/main/fitbit/oauthcallback').then(result => {
        // use the access token to fetch the user's profile information
        token = result.access_token;
        console.log(token);
        client.get("/profile.json", result.access_token).then(results => {
        res.send(results[0]);
        }).catch(err => {
        res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

router.get("/heartrate", function(req, res) {
  

    var past_date = utilities.getPreviousDate();
    

    client.get("/activities/heart/date/" + past_date + "/1d.json", token).then(results => {

        if(results[0]["activities-heart"][0]["value"]["heartRateZones"].length > 0){
            var processed_data = data_processor.fitbitHeartRate(results[0]["activities-heart"][0]["value"]["heartRateZones"], past_date);
        }
    
        res.send({
            "status": 200,
            "result": results[0]["activities-heart"][0]["value"]["heartRateZones"]
        });
        
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

router.get("/sleep", function(req, res) {

    var past_date = utilities.getPreviousDate();

    client.get("/sleep/date/" + past_date + ".json", token).then(results => {

        
        if(results[0]["sleep"].length > 0){
            var processed_data = data_processor.fitbitSleepRate(results[0]["sleep"], past_date);
        }

        res.send({
            "status": 200,
            "result": results[0]
        });

    }).catch(err => {
        res.status(err.status).send(err);
    });
});

router.get("/sleepsummary", function(req, res) {

    var past_date = utilities.getPreviousDate();

    client.get("/sleep/date/" + past_date + ".json", token).then(results => {

        
        var processed_data = data_processor.fitbitSleepSummary(results[0]["summary"], past_date);

        res.send({
            "status": 200,
            "result": results[0]["summary"]
        });

    }).catch(err => {
        res.status(err.status).send(err);
    });
});

//Calories or Steps
router.get("/calories", function(req, res) {

    var past_date = utilities.getPreviousDate();

    client.get("/activities/calories/date/" + past_date + "/1d.json", token).then(results => {

        var processed_data = data_processor.fitbitCalories(results[0]["activities-calories"][0], past_date);
        
        res.send({
            "status": 200,
            "result": results[0]["activities-calories"][0]
        });

    }).catch(err => {
        res.status(err.status).send(err);
    });
});

router.get("/steps", function(req, res) {

    var past_date = utilities.getPreviousDate();

    client.get("/activities/steps/date/" + past_date + "/1d.json", token).then(results => {
        
        var processed_data = data_processor.fitbitSteps(results[0]["activities-steps"][0], past_date);
        
        res.send({
            "status": 200,
            "result": results[0]["activities-steps"][0]
        });

    }).catch(err => {
        res.status(err.status).send(err);
    });
});


//Home
router.get('/home', function(req, res) {
    res.send({
        "message": "Bespoke is now processing the data",
        "status": 200
    });
});


module.exports = router;




  // client.get("/activities/heart/date/" + req.params.date + "/1d.json", token)
    //   .then(async function(results) {
    //     var date = results[0]['activities-heart'][0]['dateTime'];
    //     var data = JSON.stringify(results[0]['activities-heart-intraday']['dataset']);
    //     data = data.replaceAll('"time":"', '"dateTime":"' + date + "T");
    //     result = await insert_query_json('fitbit.heartrate', data);
    //     res.send(results[0]);
    //   }).catch(err => {
    //     res.status(err.status).send(err);
    //   });