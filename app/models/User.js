//Required dependences 
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = mongoose.Schema({

username: {
		type: String,
		unique: true,
        required: true
},
email: {
    type: String,
    unique: true,
    required: true
},
password: {
		type: String,
        required: true
},

})

UserSchema.plugin(uniqueValidator);
var User = mongoose.model("User", UserSchema);
module.exports = User;