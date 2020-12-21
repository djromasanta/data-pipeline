const express = require('express');
const router = express.Router();

const request = require('request');
const api_config = require('../api_keys.json');

//Utilities Controller
const UtilSource = require('../controller/utilities');
const utilities = new UtilSource();

//Database Views
const DBViews = require('../model/db_views');
const dbViews = new DBViews(); 



router.get('/data/clients', function(req, res) {
	
    var date = req.query.date;

    dbViews.getClientInfo().then(clients => {

        res.send(clients);
    });	


});

router.get('/data/tables', function(req, res) {
	
    var client = req.query.client;

    dbViews.getTableInfo(client).then(tables => {

        res.send(tables);
    });	


});


router.get('/data/table_data', function(req, res) {
    
    var client = req.query.client;
    var table = req.query.table;
    var date_val = req.query.date;

    var client_list = {
        "RescueTime": "activity_date",
        "Oura": "summary_date",
        "Fitbit": "activity_date"
    }


    dbViews.getTableData(table, client_list[client], date_val).then(result => {
        console.log(table, client_list[client], date_val)
        res.send(result);
        
    });	


});




module.exports = router;