var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var HTMLing = require('htmling');
var cors = require('cors')
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/events');
var db = mongoose.connection;
var routes = require('./app/routes');


// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Static Folder
app.use(express.static(path.join(__dirname, '/public')));


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(cors());
app.use(session({ secret: 'woot',
                  resave: true, 
                  saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());
// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.errors=null;
  res.locals.messages=null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  req.session.user = req.user || null;
  next();
});

//API
app.use('/', routes);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
