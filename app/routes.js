var Event = require('../app/Event.js');
var User = require('../app/User.js');
var bodyParser = require('body-parser');
var escapeStringRegexp = require('escape-string-regexp');
// var parseICS = require('../app/icsparser.js');
var alexaVerifier = require('alexa-verifier');

module.exports = function(app, passport){
        app.get('/test', function(req, res) {
                res.send("ok");
        });

        // ::: VIEWS :::

        app.get('/profile', function(req, res) {
			res.render('profile.ejs');
        });

        app.get('/login', function(req, res) {
                res.render('login.ejs');
        });

        app.get('/logout', function(req, res) {
                req.logout();
                res.redirect('/login');
        });

        // ::: GOOGLE AUTHENTICATION ::: 

        // profile gets us their basic information including their name
        // email gets their emails
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
                passport.authenticate('google', {
                        successRedirect : '/test',
                        failureRedirect : '/login'
                }));

        // ::: USER-CREATED EVENTS HANDLING :::

		app.post('/getCurrentEvents', function(req, res) {
			
		});
		
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

        app.post('/searcheventbytags', function(req, res) {
                var tagList = req.body.tags;
                var eventList = [];

                for (var i = 0 ; i < tagList.length; i++) {
                        var currTag = tagList[i];
                        Event.find({'events.tags.tag' : currTag}, function(err, docs){
                                for (var j = 0 ; j < docs.length; j++){
                                        eventList.push(docs[j]);
                                        console.log(eventList);
                                }

                                if (i == tagList.length - 1)
                                        res.end(JSON.stringify(eventList));
                        });
                }

        });

        app.post('/findEventAll', requestVerifier, function(req, res) {
				/**
                var eventList = [];
                Event.find({}, function(err, docs) {
                        eventList = docs;
                        console.log(docs);
                        res.end(JSON.stringify(eventList));
                });
				**/
				
				var responseJSON = {'version' : '1.0', 'sessionAttributes' : {},
									'response' : {
										'shouldEndSession' : true,
										'outputSpeech' : {
											'type' : 'SSML', 
											'ssml' : '<speak> Hello you are a little bitch </speak>'
										},
				}};
				res.end(JSON.stringify(responseJSON));
        });

        app.post('/findEventByFriend', function(req, res) {

        });

        // ::: FRIEND HANDLING :::

        app.get('/searchusers', /* isLoggedIn, */ function(req, res) {
                res.render('searchusers.ejs', {user: req.user});
        });

        app.post('/searchusers', function(req, res) {
                var namequery = req.param('namequery');
                if (namequery) {
                        User.find({
                                'user.google.name': new RegExp(escapeStringRegexp(namequery), "i")
                        }).select({'user.google.name': 1, 'user.google.email': 1}).exec((error, users) => {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(users.map(user => user.user.google)));
                        });
                }

        });

        app.post('/addfriend', function(req, res) {
			var friend = res.body.friend;
			var user = req.user;
			user.user.data.friends.push(friend);
        });

        app.post('/removefriend', function(req, res) {
			var friend = res.body.friend;
			User.find('user.google.id', friend, function(err, docs){
				docs.remove();
			});
        });

        // ::: SCHEDULE(RECURRING) STUFF ::::

        app.get('/addschedule', isLoggedIn, function(req, res) {
                res.render('addschedule.ejs', {user: req.user});
        });

        app.post('/addschedule', function(req, res) {
                var ical = req.body.ical;
                if (typeof ical === "string") {
                        var parsed = require("../app/icsparser")(req.body.ical)
                        console.log(parsed);
                }

        });

        app.get('/removescheduleelement', function(req, res) {

        });

        // ::: EXTRANEOUS METHODS :::

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

function requestVerifier(req, res, next) {
    alexaVerifier(
        req.headers.signaturecertchainurl,
        req.headers.signature,
        req.rawBody,
        function verificationCallback(err) {
            if (err) {
                res.status(401).json({ message: 'Verification Failure', error: err });
            } else {
                next();
            }
        }
    );
}
