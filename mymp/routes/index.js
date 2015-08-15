var User       = require('../app/models/user');
var Friend       = require('../app/models/friend');
async = require("async");
var path = require('path'),
    fs = require('fs');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/', function(request, response) {
		response.render('index.html');
	});
	router.get('/user', auth, function(request, response) {
		response.render('user.html', {
			user : request.user
		});
	});


	router.get('/image.png', function (req, res) {
    		res.sendfile(path.resolve('./uploads/image_'+req.user._id));
	}); 


	router.get('/edit', auth, function(request, response) {
		response.render('edit.html', {
			user : request.user
		});
	});
	router.get('/about', auth, function(request, response) {
		response.render('about.html', {
			user : request.user
		});
	});
	router.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/');
	});

		router.get('/login', function(request, response) {
			response.render('login.html', { message: request.flash('error') });
		});
/*
		router.post('/login', passport.authenticate('login', {
			successRedirect : '/about', 
			failureRedirect : '/login', 
			failureFlash : true
		}));
*/
		router.get('/signup', function(request, response) {
			response.render('signup.html', { message: request.flash('signuperror') });
		});

/*
		router.post('/signup', passport.authenticate('signup', {
			successRedirect : '/about',
			failureRedirect : '/signup', 
			failureFlash : true 
		}));
		
*/		
		router.get('/edit', function(request, response) {
			response.render('edit.html', { message: request.flash('updateerror') });
		});


		router.post('/edit',  function (req, res){
				 var tempPath = req.files.file.path,
        			targetPath = path.resolve('./uploads/'+req.files.file.originalFilename);
    				if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        				fs.rename(tempPath, './uploads/image_'+req.user._id, function(err) {
            					if (err) throw err;
            				console.log("Upload completed!");
        				});
    				}
 			 User.findOne({ 'user.email' :  req.body.email }, function(err, user) {
                		if (err){ return done(err);}
                		if (user)
                    			user.updateUser(req, res)

                         });
  		});
		
		router.get('/profile', auth, function(request, response) {
			var query = Friend.find({'friend.mainfriendid': request.user._id}, { 'friend.anotherfriendid': 1 });
			query.exec(function(err, friends) {

      		if (!err) {
		var frdDetails = []

		async.each(friends,
    			function(friend, callback){
				if(friend.friend.anotherfriendid == ''){
			console.log('No Friend')
				}else{
    					User.findById(friend.friend.anotherfriendid, function(err, user) {
						frdDetails.push(user.user.name+', '+user.user.address);
 						callback();
					});
   				}
  			},
  			function(err){
         			response.render('profile.html', {
					user : request.user,
					friends: frdDetails
				});
  			}
		);
       		} else {
         		res.send(JSON.stringify(err), {
            			'Content-Type': 'application/json'
         		}, 404);
      		}
   		});

	});



		router.post('/friend',  function (request, response){
				Friend.findOne({ $and: [ {'friend.mainfriendid': request.param('mainfriendid')}, { 'friend.anotherfriendid': request.param('anotherfriendid') } ] }, function(err, friend) {
            	    		if (err){ return done(err);}
                    		if (friend) {
				response.redirect('/profile');

                    		} else {
				if(request.param('anotherfriendid') != ''){
				var newFriend            = new Friend();
 			 	newFriend.friend.mainfriendid = request.param('mainfriendid');
				newFriend.friend.anotherfriendid = request.param('anotherfriendid');
	 			newFriend.save();
				}
				response.redirect('/profile');
				}
 				});
  		});



// GET /auth/facebook
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Facebook authentication will involve
// redirecting the user to facebook.com. After authorization, Facebook will
// redirect the user back to this application at /auth/facebook/callback
//		router.get('/auth/facebook',
//  			passport.authenticate('facebook',{ scope : 'email' }));

// GET /auth/facebook/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
//		router.get('/auth/facebook/callback',
//  			passport.authenticate('facebook', { 
//				successRedirect : '/about', 	
//				failureRedirect: '/login' }));





// GET /auth/twitter
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Twitter authentication will involve redirecting
// the user to twitter.com. After authorization, the Twitter will redirect
// the user back to this application at /auth/twitter/callback
//router.get('/auth/twitter',
//  passport.authenticate('twitter'));

// GET /auth/twitter/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
//router.get('/auth/twitter/callback',
//  passport.authenticate('twitter', { 
//				successRedirect : '/about', 	
//				failureRedirect: '/login' }));


// GET /auth/google
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Google authentication will involve
// redirecting the user to google.com. After authorization, Google
// will redirect the user back to this application at /auth/google/callback
//router.get('/auth/google',
//  passport.authenticate('google', { scope : ['profile', 'email'] }));

// GET /auth/google/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
//router.get('/auth/google/callback',
//  passport.authenticate('google', { 
//				successRedirect : '/about', 	
//				failureRedirect: '/login' }));


//var io = require('socket.io').listen(server);

//var usernames = {};

//io.sockets.on('connection', function (socket) {

//  socket.on('adduser', function(username){
//    socket.username = username;
//    usernames[username] = username;
//    io.sockets.emit('updateusers', usernames);
//  });

 // socket.on('disconnect', function(){
 //   delete usernames[socket.username];
 //   io.sockets.emit('updateusers', usernames);
 //   socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
 // });
//});
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


module.exports = router;
