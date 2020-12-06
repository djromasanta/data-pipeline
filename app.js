require('dotenv').config({path: __dirname + '/.env'});
const express = require('express');
const app = express();


//REQUIRED ROUTES
const rescuetime = require('./routes/rescuetime');
const fitbit = require('./routes/fitbit');
const oura = require('./routes/oura');

const DBConnection = require('./model/database');
const dbCon = new DBConnection(); 


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/* ROUTES */
app.use('/main/rescuetime', rescuetime);
app.use('/main/fitbit', fitbit);
//app.use('/main/oura', oura);

app.get('/', function(req, res) {
  res.send({
    "status": 200,
    "message": "Welcome to Data Pipeline!"
});

});


module.exports = app;

var server = app.listen(process.env.PORT || 80, function () {
  var port = server.address().port;
  console.log('Listening at port ' + port);
});