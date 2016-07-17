var facebookdb = "mongodb://localhost:27017/faceBookdb"; 
var mongo = require("./mongo"); //Database configuration file 

function getPosts(msg, callback){   
	var res = {};  
	var userId = msg.Email;
	console.log("In getPosts handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			console.log("In getPosts  handle request:"+ msg.Email); 
			var query = {$or: [ { userId_1:userId },{userId_2:userId }],accepted:1};
			var fcoll = mongo.collection('friend'); 
				fcoll.find(query).toArray(
						function(err, friend){
							console.log(friend);
							var array=[userId];
							var value;
							for (i=0;i<friend.length;i++){
								if (friend[i].userId_2 ==userId )
									value = friend[i].userId_1;
								else
									value= friend[i].userId_2;
							array.push(value);
							}
							console.log(array);
						var coll = mongo.collection('posts'); 
			
						var query = { Email: { $in:array }};
							coll.find(query).sort({time: -1 }).toArray( 
									function(err, posts){
										console.log(posts);		
				if (err) { 
					console.log("Failed getposts");
					res.code = "401";   
					res.value =null;
					callback(null, res);	
				}else{
					console.log("Succes getposts");
					res.code = "200"; 
					var json = JSON.stringify({ 
					    "posts":posts ,  
					});
					res.value = json;
					callback(null, res);
				}
					});
						});
		});
}





function addPost(msg, callback){   
	var res = {};  
	console.log("In addPost handle request:"+ msg.Email+msg.post); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			var coll = mongo.collection('posts'); 
			var query = {Email:msg.Email, post:msg.post,time:new Date().getTime()};
			 coll.insert(query, function(err,post){
				 if(err){
					 console.log("error Inserting");
					 console.log("Failed addPost");
						res.code = "401";   
						res.value = "Failed addPost";
						callback(null, res);
				 }else{
					 
							console.log("Succes add post");
							res.code = "200";   
							res.value = "Succes add post";
							callback(null, res);
						}	
				
						});
			
			 });
							
	
	};

	
		
exports.getPosts = getPosts;
exports.addPost=addPost;