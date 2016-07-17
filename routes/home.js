var mq_client = require('../rpc/client');



exports.after_sign_in = function (req,res) { 
	console.log("after_sign_in");
	var Email = req.param("Email");  
	var Password = req.param("Password");  
	var msg_payload = { "Email": Email, "Password": Password}; 
	console.log("connecting to mqRabbit");
	mq_client.make_request('login_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {    
				if(results.code == 200){     
					console.log("valid Login");
					var user = results.value;
					req.session.Email = user.Email;
					req.session.FirstName= user.FirstName;
					console.log("In Home succes Login and session Email ="+ req.session.Email);
					res.send({"login":"Success"}); 
					
					}    else {             
						console.log("Invalid Login");     
						res.send({"login":"Fail"});    
						}   
				}    
		});
};


exports.addPost = function(req,res){
	var Email = req.session.Email;
	var post = req.param("post");
	var msg_payload = { "Email": Email,"post":post, "action":"add"}; 
	mq_client.make_request('post_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {   
				if(results.code == 200){     
					console.log("valid addPost"); 
					res.send({"code":"200",'value':results.value});      
					}    else {             
						console.log("Invalid addPost");     
						res.send({"code":"401","value":results.value});    
						}  
				
		}
	});
};

exports.addinterest = function(req,res){
	var Email = req.session.Email;
	var interestName = req.param("interestName");
	var msg_payload = { "Email": Email,"interestName":interestName, "action":"addinterest"}; 
	mq_client.make_request('interest_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {   
				if(results.code == 200){     
					console.log("valid addInterest"); 
					res.send({"code":"200",'value':results.value});      
					}    else {             
						console.log("Invalid addInterest");     
						res.send({"code":"401","value":results.value});    
						}  
				
		}
	});
};

exports.profile = function(req,res){
	var Email = req.session.Email;
	var msg_payload = { "Email": Email,"action":"get"}; 
	mq_client.make_request('post_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else  {
				var posts= null;
				if(results.value!= null){
				var json = JSON.parse(results.value);
				var posts= json.posts
				}
				res.render('profile',{user:req.session.FirstName, posts:posts});
			}
		});
	};
exports.after_sign_up = function (req,res) { 
	var Email = req.param("Email");  
	var Password = req.param("Password");  
	var FirstName = req.param("FirstName");  
	var LastName = req.param("LastName");  
	var msg_payload = { "Email": Email, "Password": Password,"FirstName" :FirstName, "LastName":LastName}; 
	mq_client.make_request('signup_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {    
				if(results.code == 200){     
					console.log("valid singup"); 
					res.send({"Singup":"Success"});      
					}    else {             
						console.log("Invalid Singup");     
						res.send({"Singup":"Fail"});    
						}   
				}    
		});
};

exports.sign_in = function (req,res) { 
	res.render('signin', {error: null});
}

exports.interest = function (req,res) {
	var Email = req.session.Email;
	var msg_payload = { "Email": Email,"action":"get"}; 
	mq_client.make_request('interest_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else  {
				var posts= null;
				if(results.value!= null){
				var json = JSON.parse(results.value);
				var interests= json.interests
				}
				res.render('interest',{interests:interests});
			}
		});
}
// Friends
exports.friendReq = function (req,res) {
	var Email = req.session.Email;
	var msg_payload = { "Email": Email,"action":"friendReq"}; 
	mq_client.make_request('friend_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {    
				if(results.code == 200){ 
					console.log(results.value);
					res.render('friend', {friends: results.value,flag:1});
				}
			}
					
		});
	
}
exports.friendList = function (req,res) { 
	var Email = req.session.Email;
	var msg_payload = { "Email": Email,"action":"friendList"}; 
	mq_client.make_request('friend_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {    
				if(results.code == 200){ 
					console.log(results.value);
					res.render('friend', {friends: results.value,flag:0});
				}
			}
					
		});
}

exports.after_sing_out = function (req,res) { 
	console.log("logout");
	req.session.destroy(); //destroy session
	if(!req.session){
		console.log("session destroyed");
	}
	res.render('signin');
}





	
