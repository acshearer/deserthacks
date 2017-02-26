var Event = require('../app/Event.js');
var User = require('../app/User.js');
var bodyParser = require('body-parser');
var escapeStringRegexp = require('escape-string-regexp');
var ICS = require('../app/icsparser.js');
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

        app.post('/findEventAll', function(req, res) {
        });

        app.post('/findEventByFriend', function(req, res) {

        });

        // ::: FRIEND HANDLING :::

        app.get('/searchusers', isLoggedIn, function(req, res) {
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

        app.post('/searchFriendById', function(req, res) {
                var idToCheck = req.body.friendId;
                res.end(JSON.stringify(getDocumentFromId(idToCheck)));
        });

        app.post('/addfriend', function(req, res) {
                var friend = req.body.friend;
                var user = req.user;
                user.user.data.friends.push(friend);
                user.save();
        });

        app.post('/removefriend', function(req, res) {
                var friend = req.body.friend;
                User.find('user.google.id', friend, function(err, docs){
                        docs.remove();
                });
        });

        app.post('/seeIfFree', function(req, res) {
                var idToCheck = req.body.friendId;
                var documentToCheck = getDocumentFromId(idToCheck);



                var now = new Date();

                var day = now.getDay();

                // This is the amount of seconds since midnight.
                // Sorry for the stupid variable name
                var secs = now.getSeconds() + (60 * (now.getMinutes() + (60 * now.getHours())));

                var free = isFree(documentToCheck, day, secs);


                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({free: free}));
        });

        app.post('/findFreeFriends', function(req, res) {
                var user = req.user;

        });

        // ::: SCHEDULE(RECURRING) STUFF :::

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


        // ::: ALEXA SHIT :::
        

        app.post('/alexa', function(req, res) {
                res.json({
                        "version": "1.0",
                        "response": {
                                "shouldEndSession": true,
                                "outputSpeech": {
                                        "type": "SSML",
                                        "ssml": "<speak>Test</speak>"
                                }}
                });
        });
}

// userDoc is a user document
// time is the number of seconds since midnight
function isFree(userDoc, dayNumber, time) {
        const now = new Date();
        const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        var schedule = userDoc.user.data.schedule;
        var free = !schedule.some(itemobj => {
                var item = itemobj.scheduleEvent;
                if (item.ignore) return true;

                var days = item.days_of_week.split(" ").map(day => days[day]);

                if (days.indexOf(dayNumber) > -1) {
                        return secs >= item.start_time && secs <= item.end_time;
                }

                return false;

        });

}

function getDocumentFromId(id){
        User.findOne({'user.google.id' : id }, function(err, docs) {
                if (err)
                        return {};
                return docs;
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
