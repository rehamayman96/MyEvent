//Required dependences 
var LocalStrategy=require('passport-local').Strategy;
var User = require('../models/User');
var bcrypt = require('bcryptjs');

module.exports = function(passport){

passport.use('login', new LocalStrategy(
  function(username, password, done) {
     User.findOne({username:username}, function(err, user){
   	if(err) {
   		throw err;
   	}
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   		bcrypt.compare(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));
//Serialize the authenticated user 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Deserialize the authenticated user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
}