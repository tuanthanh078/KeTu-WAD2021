var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  console.log("[ROUTER users.js] post");
  console.log(`Username: ${username} Password: ${password}`);

  let loginCorrect = false;

  MongoClient.connect( url, {useUnifiedTopology: true}, function(err,client){
	  if(err) throw err;
	  var db = client.db("advizDB");
	  db.collection("users").findOne({username: username}, function(err, result) {
		if(err){
			throw(err);
		}
		
		if(password == result.password){
			res.status(200).json({"username": username, "isAdmin": result.isAdmin});
		}else{
			res.status(401);
		}
		
		client.close();
		res.end();
	  });
  });
});

module.exports = router;
