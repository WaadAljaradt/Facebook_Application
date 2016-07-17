var facebookdb = "mongodb://localhost:27017/faceBookdb"; 
var mongo = require("./mongo"); //Database configuration file 

var bcrypt = require('bcrypt-nodejs');

function handle_request(msg, callback){   
	var res = {};  
	console.log("In Sing up handle request:"+ msg.Email); 
	  var query = {Email:msg.Email};

	 bcrypt.hash(msg.Password, null, null, function(err, hash) {
	  console.log(hash);
		  var userObject = {Email: msg.Email, Password: hash, FirstName: msg.FirstName, LastName: msg.LastName};
		  console.log("User:" +msg.Email);
		  mongo.connect(facebookdb, function(){ 
			  console.log('Connected to mongo at: ' + facebookdb);
			  var coll = mongo.collection('users'); 
		  coll.findOne(query, function(err, user){
		      if (user) {
		    	  console.log(user);
		    	  console.log("User already exists Error" +user);
		        res.code = "401";   
				res.value = "User already exists"; 
				callback(null, res);
		      } else {
		        // create the new user
		        coll.insert(userObject, function(err,user){
		        	if(user){
		        	console.log("success" +user);
		        	res.code = "200";   
					res.value = "Succes Sing Up";
					callback(null, res);
		        	}else{
		        		console.log("error");
		        		res.code = "401";   
						res.value = "Failed SingUp"; 
		        }
		        	callback(null, res);
		        });
		      }
		  });
		  });
	} );

}




exports.handle_request = handle_request;