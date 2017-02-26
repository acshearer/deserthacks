var mongoose = require('mongoose');

var schema = mongoose.Schema({
	events : {
		tags : [{tag: String}],
		friendsVisible : [{tag: String}],
		time_started : Date,
		time_ended : Date,
		name : String,
		description: String,
	}
});

module.exports = mongoose.model('Event', schema);
	