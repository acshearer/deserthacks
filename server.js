var express = require('express');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');

// server handling
var morgan = require('morgan');
var session = require('express-session')
app.use(morgan('dev'));

// allow X Http Requests
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Data, folder, IDDelete, IDMove, fromFolder, toFolder, addFolder');
	
	if ('OPTIONS' == req.method) {
		 res.send(200);
	} else {
		next();
	}
});

// initialize passport
require('./app/passport.js')(passport);
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());

// static file handling
app.use(express.static(__dirname + '/static'));

// initialize the routes
require('./app/routes.js')(app, passport);


// initialize the database
var configDB = require('./app/database.js');
mongoose.connect(configDB.url);

// start the server
var port_number = (process.env.PORT || 8080);
app.listen(port_number);
console.log('Server is running on ' + port_number + '...');
