const express = require('express');
const router = express.Router();

const request = require('request');
const api_config = require('../api_keys.json');


//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource(); 


//Home
router.get('/home', function(req, res) {
    res.send({
        "message": "Bespoke is now processing the data",
        "status": 200
    });
});


// Fitbit Client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
  clientId: "22BZTD",
  clientSecret: "802038298b4ffb063bda91217d6df550",
  apiVersion: '1.2'
});

let token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJaVEQiLCJzdWIiOiI4V1Q0SkQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjAzNTg4OTc2LCJpYXQiOjE2MDM1NjAxNzZ9.aaMvxakMEh_Q_yPgE5vSDs9yE045iIHefLoMCxBzLl4
eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkJaVEQiLCJzdWIiOiI4V1Q0SkQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjAzNTg5MDAxLCJpYXQiOjE2MDM1NjAyMDF9.1BxZdHoHaGn0F0YpYcC-mP2wbe8PmY2TlEjmRiQVH_k`;

// redirect the user to the Fitbit authorization page
router.get("/authorize", (req, res) => {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:5050/main/fitbit/oauthcallback'));
});

router.get("/fitbit/oauthcallback", (req, res) => {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://localhost:5050/main/fitbit/oauthcallback').then(result => {
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

router.get("/heartrate/:date", function(req, res) {
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

    client.get("/activities/heart/date/" + req.params.date + "/1d.json", token).then(results => {
        res.send(results[0]);
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

router.get("/sleep/:date", function(req, res) {

    client.get("/sleep/date/" + req.params.date + ".json", token).then(results => {
        res.send(results[0]);
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

//Calories or Steps
router.get("/activity/:activity/:date", function(req, res) {

    client.get("/activities/" + req.params.activity + "/date/" + req.params.date + "/1d.json", token).then(results => {
        res.send(results[0]);
    }).catch(err => {
        res.status(err.status).send(err);
    });
});



module.exports = router;