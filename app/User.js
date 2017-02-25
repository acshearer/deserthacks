var mongoose = require('mongoose');

var schema = mongoose.Schema({
	user : {
		local : {
			userId: String,
		},
		data : {
			userTags : [tag: String],
			friends : [friend: String],
			visibilityModifier : true,
			schedule : [scheduleEvent: {ignore : false, 
										start_date : date,
										end_date : date,
										days_of_week: String,
										start_time : Time,
										end_time : Time}],
		}
	},
	events : {
		tags : [tag: String],
		friendVisible : [friendId : String],
		time : [time_started : Date, time_ended: Date],
		name : String,
		description: String,
		}
	}, { minimize : false });

module.exports = mongoose.model('User', schema);