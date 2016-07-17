var facebookdb = "mongodb://localhost:27017/faceBookdb"; 
var mongo = require("./mongo"); //Database configuration file 
var bcrypt = require('bcrypt-nodejs');

function handle_request(msg, callback){   
	var res = {};  
	console.log("In Login handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			var coll = mongo.collection('users'); 
			
			var query = {Email:msg.Email};
			coll.findOne(query, 
					function(err, user){
				if (user) { 
					bcrypt.compare(msg.Password, user.Password, function(err, auth) {
						console.log(auth);
					 if(auth== true){
					console.log(user);
					console.log("Succes login");
					res.code = "200";   
					res.value = user;
					callback(null, res);
					 }else {
						console.log("Failed Login Password incorrect");
						res.code = "401";   
						res.value = "Failed Login Password incorrect";
						callback(null, res);
						 
					 }
					});
				}else{
					console.log("Failed login user doesnt exsit");
					res.code = "401";   
					res.value = "Failed login user doesnt exsit";
					callback(null, res);
				}	
			});
		});
		
	}
	
		
exports.handle_request = handle_request;