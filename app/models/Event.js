var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Fun', 'Work', 'Family', 'Other'],
        required: true
    },
    username: {
        type: String,
        required: true
    }
})



var Event = mongoose.model("Event", EventSchema);
module.exports = Event;