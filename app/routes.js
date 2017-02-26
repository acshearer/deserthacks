module.exports = function(app, passport){
	app.get('/', function(req, res) {
                res.render('facade.ejs');       
	});
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

        app.get('/createevent', function(req, res) {

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
