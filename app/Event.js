var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
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
	}}, { minimize : false });

module.exports = mongoose.model('User', eventSchema);