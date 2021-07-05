var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const url = "mongodb://localhost:27017";

function fullname(contact){
	return contact.firstname + " " + contact.lastname;
}
function address(contact){
	return contact.street + " " + contact.streetnr + " " + contact.zip +" " + contact.city;
}


router.post('/', function(req, res, next) {
  console.log("[ROUTER contacts.js] post");
  console.log(req.body);
	
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
	if(err) throw err;
	var db = client.db("advizDB");
	db.collection("contacts").insertOne(
		{
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			street: req.body.street,
			streetnr: req.body.streetnr,
			zip: req.body.zip,
			city: req.body.city,
			state: req.body.state,
			country: req.body.country,
			isPrivate: req.body.isPrivate,
			owner: req.body.owner,
			lat: req.body.lat,
			lng: req.body.lng
		}, function(err, result){
			if(err)throw(err);
			console.log("Contact "+fullname(req.body)+" inserted");
			client.close();
			res.status(201).send(result.ops[0]._id);
			res.end();
		}
	);
  });
});

router.get('/', function(req, res, next) {
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
	if(err) throw err;
	var db = client.db("advizDB");
	db.collection("contacts").find({}).toArray(function(err,result){
		if(err) throw err;
		client.close();
		res.status(200).send(result);
		res.end();
	});
  });
});

router.get('/:id', function(req, res, next) {
	
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
	if(err) throw err;
	var db = client.db("advizDB");
	db.collection("contacts").findOne({_id: new ObjectId(req.params.id)}, function(err,result){
		if(err) throw err;
		client.close();
		res.status(200).send(JSON.stringify(result));
		res.end();
	});
  });
});

router.put('/:id', function(req, res, next) {
  
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
	if(err) throw err;
	var db = client.db("advizDB");
	
	var find = {_id: new ObjectId(req.params.id)};
	var replacement = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		street: req.body.street,
		streetnr: req.body.streetnr,
		zip: req.body.zip,
		city: req.body.city,
		state: req.body.state,
		country: req.body.country,
		isPrivate: req.body.isPrivate,
		owner: req.body.owner,
		lat: req.body.lat,
		lng: req.body.lng
	}
	
	db.collection("contacts").replaceOne(find,replacement, function(err,result){
		if(err) throw err;
		client.close();
		res.status(200);
		res.end();
	});
  });
});

router.delete('/:id', function(req, res, next) {
	
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client){
	if(err) throw err;
	var db = client.db("advizDB");
	db.collection("contacts").deleteOne({_id: new ObjectId(req.params.id)}, function(err,result){
		if(err) throw err;
		client.close();
		res.status(200);
		res.end();
	});
  });
});

module.exports = router;
