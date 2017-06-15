//Required Dependencies
let User = require('../models/User');
var bcrypt = require('bcryptjs');
var passport = require('passport');
require('../config/passport')(passport);

let userController = {
    //Passport authentication for the login function
    passportauth: passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }),
    
    //Login function for the API /login
    login: function (req, res) {
        req.flash('success_msg', 'You are logged in correctly :)');
        res.redirect('/addevent');
    },

    //Funcyion to ensure that the user is authurized to access the API
    ensureAuthentication: function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'You are not logged in!');
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
        //check if any of the inputs is empty
        var errors = req.validationErrors();
        if (errors) {
            res.render('register', {
                errors: errors
            });
        }
        else {
            //Check for duplicated email
            User.findOne({ email: req.body.email }, function (err, user) {
                if (user) {
                    req.flash('error_msg', 'Email is already used');
                    res.redirect('/register');
                } else {
                    //check for duplicated username
                    User.findOne({ username: req.body.username }, function (err, user2) {
                        if (user2) {
                            req.flash('error_msg', 'Username is already used');
                            res.redirect('/register');
                        }
                        else {
                            //verfiy the strength of the password
                            var regularExpression = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/;
                            if (!regularExpression.test(req.body.password)) {
                                req.flash('error_msg', 'Password must be alpha numeric between 6-15 character ');
                                res.redirect('/register');
                            }
                            else {
                                let user = new User({
                                    username: req.body.username,
                                    email: req.body.email,
                                });
                                //encrypt the password bofore saving in the user collecion
                                bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                                        user.password = hash;
                                        user.save(function (err, user) {
                                            if (err) {
                                                req.flash('error_msg', 'Username is already used');
                                                res.redirect('/register');
                                            }
                                            else {
                                                req.flash('success_msg', 'You are registered and can now login');
                                                res.redirect('/login');
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    })
                }
            })
        }
    },


}
module.exports = userController;
