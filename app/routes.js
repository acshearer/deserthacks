var User = require('../app/User.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport){
	app.get('/test', function(req, res) {
		res.send("ok");
	});
	
	app.get('/login', function(req, res) {
        res.render('login.ejs');
    });
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
	
	// profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/test',
                    failureRedirect : '/login'
            }));
	
	// ::: USER CREATED EVENTS :::
	
	app.get('/testAddEvent', function(req, res) {
		res.render('testEventAdd.ejs');
	});
	
	app.post('/createevent', function(req, res) {
		var events = req.body;
		var user = req.user;
		console.log(req.body);
		var userEvent = JSON.parse(events);
		user.user.data.events.push(userEvent);
	});

	app.post('/findeventByTag', function(req, res) {
		var tagList = req.body.tags;
		var eventList = [];
		
		for (var i = 0 ; i < tagList.length; i++) {
			var currTab = eventList[i];
			//User.aggregate([{$match: { 'user.data.events.tags' }}]);
		}
	});
	
	app.post('/findEventAll', function(req, res) {
		
	});
	
	app.post('/findEventByFriend', function(req, res) {
		var friendList = req.body.friends;
		var eventList = [];
		
		for (var i = 0 ; i < friendList.length; i++) {
			//User.aggregate([]);
		}
		
		db.test.aggregate([
    // Get just the docs that contain a shapes element where color is 'red'
    {$match: {'shapes.color': 'red'}},
    {$project: {
        shapes: {$filter: {
            input: '$shapes',
            as: 'shape',
            cond: {$eq: ['$$shape.color', 'red']}
        }},
        _id: 0
    }}
])
	});
	
	// ::: FRIEND HANDLING :::

	app.get('/friendprofile', function(req, res) {
		
	});
	
	app.get('/addfriend', function(req, res) {
		
	});

	app.get('/removefriend', function(req, res) {
		
	});

	app.get('/addschedule', function(req, res) {
		
	});

	app.get('/removescheduleelement', function(req, res) {
		
	});

	app.get('/addevent', function(req, res) {
		
	});

	app.get('/changeuservisibility', function(req, res) {
		
	});
}


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}