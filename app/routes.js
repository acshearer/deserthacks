var Event = require('../app/Event.js');
var User = require('../app/User.js');
var bodyParser = require('body-parser');
var escapeStringRegexp = require('escape-string-regexp');

module.exports = function(app, passport){
        app.get('/test', function(req, res) {
                res.send("ok");
        });

        // ::: VIEWS :::

        app.get('/profile', function(req, res) {

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

        app.post('/findEventAll', function(req, res) {
                var eventList = [];
                Event.find({}, function(err, docs) {
                        eventList = docs;
                        console.log(docs);
                        res.end(JSON.stringify(eventList));
                });
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

        });

        app.post('/removefriend', function(req, res) {

        });

        app.get('/friendprofile', function(req, res) {

        });


        // ::: SCHEDULE(RECURRING) STUFF ::::

        app.get('/addschedule', function(req, res) {

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

