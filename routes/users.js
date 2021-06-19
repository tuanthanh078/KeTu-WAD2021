var express = require('express');
var router = express.Router();

function User(username, password, isAdmin){
	this.username = username;
	this.password = password;
	this.isAdmin = isAdmin;
}

var admina = new User("admina", "admina", true);
var normalo = new User("normalo", "normalo", false);
var users = [admina, normalo];

router.post('/', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  console.log("[ROUTER users.js] post");
  console.log(`Username: ${username} Password: ${password}`);

  let loginCorrect = false;

  for (let i = 0; i < users.length; i++) {
    if(username === users[i].username &&
      password === users[i].password){

      //Setze Login war korrekt
      loginCorrect = true;

      res.status(200).json({"username": users[i].username, "isAdmin": users[i].isAdmin});

      break;
    }
  }

  if (!loginCorrect)
    res.status(401);
  res.end();
});

module.exports = router;
