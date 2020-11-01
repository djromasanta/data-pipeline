require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();


//REQUIRED ROUTES
const rescuetime = require('./routes/rescuetime');
const fitbit = require('./routes/rescuetime');

const DBConnection = require('./model/database');
const dbCon = new DBConnection(); 


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/* ROUTES */
//Provided to AHOLD focal for the Shell Script
app.use('/main/rescuetime', rescuetime);
app.use('/main/fitbit', fitbit);




module.exports = app;

app.listen(process.env.PORT);

console.log(`Your port is ${process.env.PORT}`);