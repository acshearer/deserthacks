var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/User.js');
var auth = require('../app/auth.js');

module.exports = function(passport) {

        // used to serialize the user for the session
        passport.serializeUser(function(user, done) {
                done(null, user.id);
        });

        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, user) {
                        done(err, user);
                });
        });

        // HANDLE GOOGLE STUFF

        passport.use(new GoogleStrategy({

                clientID        : auth.googleAuth.clientId,
                clientSecret    : auth.googleAuth.clientSecret,
                callbackURL     : auth.googleAuth.callbackURL,

        },
                function(token, refreshToken, profile, done) {

                        // make the code asynchronous
                        // User.findOne won't fire until we have all our data back from Google
                        process.nextTick(function() {

                                // try to find the user based on their google id
                                User.findOne({ 'user.google.id' : profile.id }, function(err, user) {
                                        if (err)
                                                return done(err);

                                        if (user) {

                                                // if a user is found, log them in
                                                return done(null, user);
                                        } else {
                                                // if the user isnt in our database, create a new user
                                                var newUser = new User();

                                                // set all of the relevant information
                                                newUser.user.google.id    = profile.id;
                                                newUser.user.google.token = token;
                                                newUser.user.google.name  = profile.displayName;
                                                newUser.user.google.email = profile.emails[0].value; // pull the first email

                                                newUser.user.data.alexaUserId = "";
                                                newUser.user.data.userTags = [];
                                                newUser.user.data.friends = [];
                                                newUser.user.data.visible = true;
                                                newUser.user.data.schedule = [];
                                                newUser.user.data.events = [];

                                                // save the user
                                                newUser.save(function(err) {
                                                        if (err)
                                                                throw err;
                                                        return done(null, newUser);
                                                });
                                        }
                                });
                        });

                }));

};
