var express = require('express');
var path = require('path');
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var connect = require('connect')
var http = require('http')
var server = http.createServer(app)

var flash    = require('connect-flash');
var path = require('path'), fs = require('fs');



// db
var Mongoose = require('mongoose');
//var db = Mongoose.connect('mongodb://main1:main1@localhost/admin');
var db = Mongoose.createConnection('mongodb:///opt/bitnami/mongodb/tmp/mongodb-27017.sock/local');


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


require('./config/passport')(passport); 



//	app.use(express.cookieParser());
//	app.use(express.bodyParser()); 
//	app.use(express.static(path.join(__dirname, 'public')));
//	app.set('views', __dirname + '/views');
//	app.engine('html', require('ejs').renderFile);
//	app.use(express.session({ secret: 'mymp' })); 
//	app.use(express.bodyParser({uploadDir:'/images'}));
	app.use(passport.initialize());
	app.use(passport.session()); 
	app.use(flash()); 


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


//var viewroute = require('./app/routes.js')(app, passport,server); 
var routes = require('./routes/index')(app, passport,server);
var users = require('./routes/users');
var video = require('./routes/video');

//app.use('/', viewroute);
app.use('/', routes);

app.use('/users', users);
app.use('/video', video);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});



module.exports = app;

