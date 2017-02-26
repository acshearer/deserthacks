var mongoose = require('mongoose');

var schema = mongoose.Schema({
		user : {
			google : {
				id : String,
				token : String,
				email : String,
				name : String,
			},
			data : {
				userTags : [{tag : String}],
				friends : [{friend : String}],
				visibilityModifier : Boolean,
				schedule : [{scheduleEvent: {ignore : Boolean, 
											start_date : Date,
											end_date : Date,
											days_of_week: String,
											start_time : Date,
											end_time : Date}}],
				events : [{
					tags : [{tag: String}],
					friendsVisible : [{friendId : String}],
					time : [{time_started : Date, time_ended: Date}],
					name : String,
					description: String,
				}]
			}
	}});

module.exports = mongoose.model('User', schema);