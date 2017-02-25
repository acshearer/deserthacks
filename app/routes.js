module.exports = function(app, mongoose){
	app.get('/test', function(req, res) {
		res.send("ok");
	});
	
	app.get('/login', function(req, res){
		res.render('login.js');
	});
		
	app.post('/login', function(req, res){
		
	});

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
