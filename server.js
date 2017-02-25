var express = require('express');
var mongoose = require('mongoose');
var app = express();

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

// initialize the routes
require('./app/routes.js')(app);


// initialize the database
var configDB = require('./app/database.js');

// configure database
var connectionUser = mongoose.createConnection(configDB.url1);
var connectionEvent =  mongoose.createConnection(configDB.url2);


// start the server
var port_number = (process.env.PORT || 3000);
app.listen(port_number);
console.log('Server is running on ' + port_number + '...');
