
/*
 * GET users listing.
 */
var mq_client = require('../rpc/client');
var url = require( "url" );
var queryString = require( "querystring" );

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.SearchUser = function (req,res) { 
	var UserName = req.param("UserName");
	if (!UserName){ 
		var theUrl = url.parse( req.url );
		console.log( theUrl);
		var queryObj = queryString.parse( theUrl.query );
		UserName = queryObj.friendName;
	}
	
	req.session.UserName = UserName;

	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"search"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid Search");
					req.session.userInfo = results.value;
					res.send({"code":"200"}); 
					
					}    else {             
						console.log("Invalid Search");
						res.send({"code":"401"});
					}   
			}    
	});
	
}

exports.getSearchUser = function (req,res) { 
	var UserName = req.param("UserName");
	if (!UserName){ 
		var theUrl = url.parse( req.url );
		console.log( theUrl);
		var queryObj = queryString.parse( theUrl.query );
		UserName = queryObj.friendName;
	}
	
	req.session.UserName = UserName;

	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"search"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid Search");
					req.session.userInfo = results.value;
					var json = JSON.parse(req.session.userInfo);
					console.log(json);
					res.render("user",{"name":json.name,"flag":json.flag,"request":json.request,"sender":json.sender, "posts":json.posts});
					
					}    else {             
						console.log("Invalid Search");
						res.send({"code":"401"});
					}   
			}    
	});
	
}



exports.Addfriend = function (req,res) { 
	//var UserName = req.param("UserName");
	var UserName = req.session.UserName;
	

	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"add"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid Add");
					req.session.userInfo = results.value;
					console.log(results.value);
					res.send({"code":"200"}); 
					
					}    else {             
						console.log("Invalid Add");
						res.send({"code":"401"});
					}   
			}    
	});
	
}

exports.confirm = function (req,res) { 
	//var UserName = req.param("UserName");
	var UserName = req.session.UserName;
	

	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"confirm"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid confirm");
					req.session.userInfo = results.value;
					console.log(results.value);
					res.send({"code":"200"}); 
					
					}    else {             
						console.log("Invalid confirm");
						res.send({"code":"401"});
					}   
			}    
	});
	
}
exports.decline = function (req,res) { 
	var UserName = req.session.UserName;
	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"decline"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid decline");
					req.session.userInfo = results.value;
					console.log(results.value);
					res.send({"code":"200"}); 
					
					}    else {             
						console.log("Invalid decline");
						res.send({"code":"401"});
					}   
			}    
	});
	
}



exports.unfriend = function (req,res) { 
	var UserName = req.session.UserName;
	var msg_payload = { "UserName": UserName, "Email": req.session.Email, 'action':"unfriend"}; 
	mq_client.make_request('user_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    { 
				
				if(results.code == 200){     
					console.log("valid unfriend");
					req.session.userInfo = results.value;
					console.log(results.value);
					res.send({"code":"200"}); 
					
					}    else {             
						console.log("Invalid unfriend");
						res.send({"code":"401"});
					}   
			}    
	});
	
}



