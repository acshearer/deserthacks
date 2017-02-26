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
                        userTags : [String],
                        friends : [String],
                        visibilityModifier : Number,
                        schedule : [
                                {scheduleEvent: {
                                        name : String,
                                        location : String,
                                        ignore : Boolean, 
                                        start_date : Date,
                                        end_date : Date,
                                        days_of_week: String,
                                        start_time : Date,
                                        end_time : Date}}],
                }
        }});

module.exports = mongoose.model('User', schema);
