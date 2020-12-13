require('dotenv').config({path: __dirname + '/.env'});
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();


//REQUIRED ROUTES
const rescuetime = require('./routes/rescuetime');
const fitbit = require('./routes/fitbit');
const oura = require('./routes/oura');
const views = require('./routes/view_endpoint');

// const DBConnection = require('./model/database');
// const dbCon = new DBConnection(); 

// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/', express.static('public'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




/* ROUTES FOR DATA EXTRACTOR */
app.use('/main/rescuetime', rescuetime);
//app.use('/main/fitbit', fitbit);
app.use('/main/oura', oura);
/* END ROUTES FOR DATA EXTRACTOR */

//VIEW ROUTES
app.use('/main/v1', views);

/* DASHBOARD ROUTES */
app.get('/', function(req, res) {
  if (req.session.loggedin) {
		res.render('index');
	} else {
		res.render('login', {status: ""});
	}
});

app.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {

    	if (username == "admin" && password == "admin") {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
			} else {
				res.render('login', {status: "Incorrect Username and/or Password!"});
			}		

	} else {
		res.render('login', {status: "Username and Password are Required!"});
	}
});

app.get('/home', function(req, res) {
	if (req.session.loggedin) {
      res.render('index');
	} else {
      res.redirect('/');
	}
	res.end();
});

app.get('/data', function(req, res) {
	if (req.session.loggedin) {
		  res.render('data');
	  } else {
		  res.render('login', {status: ""});
	  }
});

app.get('/import', function(req, res) {
	if (req.session.loggedin) {
		  res.render('import');
	  } else {
		  res.render('login', {status: ""});
	  }
});

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});


app.get('/testdb', function(req, res) {
	

});

module.exports = app;

var server = app.listen(process.env.PORT || 80, function () {
  var port = server.address().port;
  console.log('Listening at port ' + port);
});







// connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
		// 	if (results.length > 0) {
		// 		request.session.loggedin = true;
		// 		request.session.username = username;
		// 		response.redirect('/home');
		// 	} else {
		// 		response.send('Incorrect Username and/or Password!');
		// 	}			
		// 	response.end();
    // });