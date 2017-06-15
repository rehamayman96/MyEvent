//Required dependences 
var express = require('express');
var routes = express.Router();
var userController = require('./controller/userController');
var eventController = require('./controller/eventController');
var passport = require('passport');
require('./config/passport')(passport);
//Get APIs
routes.get('/', function (req, res) {
    res.render('index');
});

routes.get('/login', function (req, res) {
    res.render('login');
});

routes.get('/register', function (req, res) {
    res.render('register');
});

routes.get('/addevent', function (req, res) {
    res.render('addevent');
});

routes.get('/viewAllevents', userController.ensureAuthentication,eventController.viewAllevents);

routes.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
        } else {
            req.user = null;
            res.redirect('/login');
        }
    });
});
routes.get('/autocomplete/:search',userController.ensureAuthentication,eventController.autocomplete);
                /*------------------------------------------------------------------*/
//Post APIs
routes.post('/search',userController.ensureAuthentication,eventController.search);

routes.post('/login', userController.passportauth, userController.login);

routes.post('/register', userController.registerUser);

routes.post('/addevent', userController.ensureAuthentication, eventController.addEvent)

routes.post('/viewAllevents', userController.ensureAuthentication,eventController.filterevents);

module.exports = routes;