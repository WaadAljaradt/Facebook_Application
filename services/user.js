var facebookdb = "mongodb://localhost:27017/faceBookdb"; 
var mongo = require("./mongo"); //Database configuration file 

function search(msg, callback){ 
	var res = {};  
	console.log("In Search User handle request:"+ msg.UserName); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			 var query = {FirstName:msg.UserName};
			var coll = mongo.collection('users'); 
			coll.findOne(query, 
					function(err, user){
	if(!user){
		console.log("No Result for User");
		res.code = "401";   
		res.value = "No User";
		callback(null, res);
	}	else{
		var userId = msg.Email;
		var friendId = user.Email;
		console.log(userId);
		console.log(friendId);
		var query = {$or: [ { userId_1:userId, userId_2:friendId },{ userId_1: friendId,userId_2:userId } ]};
			var fcoll = mongo.collection('friend'); 
			fcoll.findOne(query,
					function(err, friend){
				console.log(friend);
				if(!friend || (friend.request == '0' && friend.accepted== '0')){
					console.log("Succes Search User Not friend");
					res.code = "200";  
					var json = JSON.stringify({ 
					   
					    name: user.FirstName,
					    flag :'0',
					    request :'0',
					    posts: null,
					});
					res.value = json;
					callback(null, res);
					
					
				}else if(friend.request == 1 && friend.senderId == userId  ){
						console.log("Succes Search User friend request sent");
						res.code = "200";  
						var json = JSON.stringify({ 
						    
						    name: user.FirstName,
						    flag :'0',
						    request :'1',
						    sender :'1',
						    posts: null,
						});
						res.value = json;
						callback(null, res);
									}else if (friend.request == 1 && friend.senderId != userId ){
											
											console.log("Succes Search User request from user");
											res.code = "200";  
											var json = JSON.stringify({ 
											    
											    name: user.FirstName,
											    flag :'0',
											    request :'1',
											    sender :'0',
											    posts: null,
											});
											res.value = json;
											callback(null, res);									
										}else{
											var query = {userId : friendId}
											var pcoll = mongo.collection('post'); 
											fcoll.findOne(query, 
													function(err, posts){
												console.log("Succes Search User is friend");
												res.code = "200";  
												var json = JSON.stringify({ 
												   
												    name: user.FirstName,
												    flag :'1',
												    request :'0',
												    sender :'x',
												    posts: posts,
												});
												res.value = json;
												callback(null, res);
												
											
										
											
								});
											}
			});
	}
			});
		});
}	
// Add friend
function add(msg, callback){ 
	var res = {};  
	console.log("In Add User handle request:"+ msg.UserName); 
	var friendName = msg.UserName;
	console.log(friendName);
	
	mongo.connect(facebookdb, function(){ 
		console.log('Connected to mongo at: ' + facebookdb);
		 var query = {FirstName:friendName};
		var coll = mongo.collection('users'); 
		coll.findOne(query, 
				function(err, user){
if(!user){
	console.log("No Result for User");
	res.code = "401";   
	res.value = "No User";
	callback(null, res);
}	else{
		console.log( user );
		var userId = msg.Email;
		var friendId = user.Email;
	
		var query = {$or: [ { userId_1:userId, userId_2:friendId },{ userId_1: friendId,userId_2:userId } ]};
	
		var fcoll = mongo.collection('friend'); 
			fcoll.findOne(query, 
					function(err, friend){
				if (!friend){
					var fObject ={userId_1 : userId, userId_2 :friendId, request:1,accepted:0,senderId:userId };
					console.log(fObject);
					 fcoll.insert(fObject, function(err,friendRe){
						 if(err){
							 console.log("error Inserting");
						 }else{
							 console.log(friendRe);
						 }
						 console.log("Succes Addtion User");
							res.code = "200";  
							var json = JSON.stringify({ 
							    name: user.FirstName,
							    flag :'0',
							    request :'1',
							    sender :'1',
							    posts: null,
							});
							res.value = json;
							callback(null, res);

					 
				});
					 }else{
					var update ={$set:{request:1,accepted:0,senderId:userId} };
					console.log(query);
					console.log(update);
					 fcoll.update(query,update, function(err,group){
						 console.log("Succes Add again User ");
							res.code = "200";  
							var json = JSON.stringify({ 
							    name: user.FirstName,
							    flag :'0',
							    request :'1',
							    sender :'1',
							    posts: null,
							});
							res.value = json;
							callback(null, res);

					 
				});
				}
			});
}
		});
	});
};
					
function confirm(msg, callback){ 
		var res = {};  
		console.log("In confirm User handle request:"+ msg.UserName); 
		var friendName = msg.UserName;
		console.log(friendName);
		
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			 var query = {FirstName:friendName};
			var coll = mongo.collection('users'); 
			coll.findOne(query, 
					function(err, user){
	if(!user){
		console.log("No Result for User");
		res.code = "401";   
		res.value = "No User";
		callback(null, res);
	}	else{
			console.log( user );
			var userId = msg.Email;
			var friendId = user.Email;
			var query = {$or: [ { userId_1:userId, userId_2:friendId },{ userId_1: friendId,userId_2:userId } ]};
			var fcoll = mongo.collection('friend'); 
				fcoll.findOne(query, 
			function(err, friend){
					console.log( user );
					var userId = msg.Email;
					var friendId = user.Email;
			
		var update ={$set: {request:0,accepted:1}};
		console.log(query);
		console.log(update);
		 fcoll.update(query,update, function(err){
			 console.log("Succes confirm again User ");
				res.code = "200";  
				var json = JSON.stringify({ 
				    name: user.FirstName,
				    flag :'1',
				    request :'0',
				    sender :'0',
				    posts: null,
				});
				res.value = json;
				callback(null, res);
					
		 });
				});
	}
			});
		});
};
	



function unfriend(msg, callback){ 
	var res = {};  
	console.log("In unfriend User handle request:"+ msg.UserName); 
	var friendName = msg.UserName;
	console.log(friendName);
	
	mongo.connect(facebookdb, function(){ 
		console.log('Connected to mongo at: ' + facebookdb);
		 var query = {FirstName:friendName};
		var coll = mongo.collection('users'); 
		coll.findOne(query, 
				function(err, user){
if(!user){
	console.log("No Result for User");
	res.code = "401";   
	res.value = "No User";
	callback(null, res);
}	else{
		console.log( user );
		var userId = msg.Email;
		var friendId = user.Email;
		var query = {$or: [ { userId_1:userId, userId_2:friendId },{ userId_1: friendId,userId_2:userId } ]};
		var fcoll = mongo.collection('friend'); 
			fcoll.findOne(query, 
		function(err, friend){
				console.log( user );
				var userId = msg.Email;
				var friendId = user.Email;
		
	var update ={$set: {request:0,accepted:0}};
	console.log(query);
	console.log(update);
	 fcoll.update(query,update, function(err){
		 console.log("Succes unfriend User ");
			res.code = "200";  
			var json = JSON.stringify({ 
			    name: user.FirstName,
			    flag :'0',
			    request :'0',
			    sender :'0',
			    posts: null,
			});
			res.value = json;
			callback(null, res);
				
	 });
			});
}
		});
	});
};






function decline(msg, callback){ 
	var res = {};  
	console.log("In decline User handle request:"+ msg.UserName); 
	var friendName = msg.UserName;
	console.log(friendName);
	
	mongo.connect(facebookdb, function(){ 
		console.log('Connected to mongo at: ' + facebookdb);
		 var query = {FirstName:friendName};
		var coll = mongo.collection('users'); 
		coll.findOne(query, 
				function(err, user){
if(!user){
	console.log("No Result for User");
	res.code = "401";   
	res.value = "No User";
	callback(null, res);
}	else{
		console.log( user );
		var userId = msg.Email;
		var friendId = user.Email;
		var query = {$or: [ { userId_1:userId, userId_2:friendId },{ userId_1: friendId,userId_2:userId } ]};
		var fcoll = mongo.collection('friend'); 
			fcoll.findOne(query, 
		function(err, friend){
				console.log( user );
				var userId = msg.Email;
				var friendId = user.Email;
		
	var update ={$set: {request:0,accepted:0}};
	console.log(query);
	console.log(update);
	 fcoll.update(query,update, function(err){
		 console.log("Succes decline again User ");
			res.code = "200";  
			var json = JSON.stringify({ 
			    name: user.FirstName,
			    flag :'0',
			    request :'0',
			    sender :'0',
			    posts: null,
			});
			res.value = json;
			callback(null, res);
				
	 });
			});
}
		});
	});
};

		 
		

exports.search = search;
exports.add = add;
exports.confirm= confirm;
exports.unfriend =unfriend;
exports.decline= decline;
