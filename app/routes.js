var Event = require('../app/Event.js');
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
		console.log(req.body); 
		var newEvent = new Event();
		
		newEvent.events.tags = events.tags;
		newEvent.events.friends = events.friends;
		newEvent.events.time_started = events.time_started;
		newEvent.events.time_ended = events.time_ended;
		newEvent.events.name = events.name;
		newEvent.events.description = events.description;

        newEvent.save(function(err) {
            console.log(err);
		});
	});
        app.get('/test', function(req, res) {
                res.send("ok");
        });

	app.post('/findEventByTag', function(req, res) {
		var tagList = req.body.tags;
		var eventList = [];
		
		for (var i = 0 ; i < tagList.length; i++) {
			var currTag = eventList[i];
			//User.aggregate([{$match: { 'user.data.events.tags' }}]);
		}
	});
	
	app.post('/findEventAll', function(req, res) {
		
	});
	
	app.post('/findEventByFriend', function(req, res) {
		var friendList = req.body.friends;
		var eventList = [];
		
		for (var i = 0 ; i < friendList.length; i++) {
			User.aggregate([]);
		}
		
		//db.test.aggregate([

	});
	
	// ::: FRIEND HANDLING :::

	app.get('/friendprofile', function(req, res) {
		
	});
	
	app.get('/addfriend', function(req, res) {
		
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

        app.get('/createevent', isLoggedIn, function(req, res) {
          res.render('addevent.ejs', {user: req.user});
        });

        app.post('/createevent', isLoggedIn, function(req, res) {

        });

        app.get('/contactfriend', function(req, res) {

        });

        app.get('/findevent', function(req, res) {

        });

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
