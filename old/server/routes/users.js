var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.collection('Users');
  	collect = collection.find().toArray(function(err,items){
	console.log(items);  
	res.send(items);});

});

router.post('/',function(req,res){
	var db = req.db;
	var collection = db.collection('Users');
	collection.insert(
	{
	
	   "name": req.fullname,
	   "mention_name": req.name,
	   "email": req.email,
	   "password":req.password,
	   "verified": 0,
 	   "is_mom": 0
	
	}
	)

});



/* GET users listing.
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
*/

module.exports = router;
