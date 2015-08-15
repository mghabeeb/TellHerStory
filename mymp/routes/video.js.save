var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.collection('Video');
  	collect = collection.find().toArray(function(err,items){
	console.log(items);  
	res.send(items);});

});

router.post('/',function(req,res){
	var db = req.db;
	var collection = db.collection('Users');
	collection.insert(
	{
	
	   "Name": req.name,
	   "Lat": req.lat,
	   "Long": req.long,
	   "Uploader_ID":req.username,
	   "Youtube_ID":req.youtube,
	   "privacy": req.privacy,
 	   "Tags": req.tag_array
	
	}
	)

}
