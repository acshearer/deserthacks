module.exports = function(app){
	app.get('/test', function(req, res) {
		res.send("ok");
	});
	
	app.get('/login', function(req, res){
		res.render('login.js', {message : req.flash('loginMessage')});
	});
		
	app.post('/login', function(req, res){
		
	});

	app.get('/createEvent', function(req, res) {
		
	});

	app.get('/contactFriend', function(req, res) {
		
	});

	app.get('/findEvent', function(req, res) {
		
	});

	app.get('/friendProfile', function(req, res) {
		
	});

	app.get('/addFriend', function(req, res) {
		
	});

	app.get('/removeFriend', function(req, res) {
		
	});

	app.get('/addSchedule', function(req, res) {
		
	});

	app.get('/removeScheduleElement', function(req, res) {
		
	});

	app.get('/addEvent', function(req, res) {
		
	});

	app.get('/changeUserVisibility', function(req, res) {
		
	});
}