//Required Dependencies
let User = require('../models/User');
var bcrypt = require('bcryptjs');
var passport = require('passport');
require('../config/passport')(passport);

let userController = {

    passportauth: passport.authenticate('login', {failureRedirect:'/login',failureFlash: true}),

    login:function(req, res) {
  	req.flash('success_msg', 'You are logged in correctly :)');
    res.redirect('/addevent');
  },

  ensureAuthentication:function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
  },

    //Registration function
    registerUser: function (req, res) {

        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is required').isEmail();

        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            res.render('register', {
                errors: errors
            });
        }
        else {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (user) {
                    req.flash('error_msg', 'Email is already used');
                    res.redirect('/register');
                } else {
                    User.findOne({ username: req.body.username }, function (err, user2) {
                        if (user2) {
                            req.flash('error_msg', 'Username is already used');
                            res.redirect('/register');
                        }
                        else {
                            let user = new User({
                                username: req.body.username,
                                email: req.body.email,
                            });

                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(req.body.password, salt, function (err, hash) {
                                    user.password = hash;
                                    user.save(function (err, user) {
                                        if (err) {
                                            req.flash('error_msg', 'Username is already used');
                                            res.redirect('/register');

                                        }
                                        else {
                                            console.log(user);
                                            req.flash('success_msg', 'You are registered and can now login');
                                            res.redirect('/login');
                                        }
                                    });
                                });
                            });
                        }
                    })
                }
            })
        }
    },

   
}
module.exports = userController;
