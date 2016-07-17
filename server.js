//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')
var signup = require('./services/signup')
var group = require('./services/group')
var user = require('./services/user')
var post = require('./services/post')
var about = require('./services/about')
var friend = require('./services/friend')
var interest = require('./services/interest')
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	
	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signup.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	cnn.queue('cgroup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.action =="create"){
			group.create_request(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}// create
			else if (message.action =="search"){
				group.search_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}	// Search
			
			
			else if (message.action =="deleteGroup"){
				group.deleteG_request(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}	// deleteGroup
			
			
			else if (message.action =="add"){
				group.AddMember(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}// list groups listGroups
			
			else if (message.action =="listGroups"){
				group.listGroups(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}
			
			//Add member
			else if (message.action =="deleteMember"){
				group.deleteMember(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}	//Delete Member
			
			
			
			else if (message.action =="show"){
				group.showMembers(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
				
			}	//Show members
			
		});
	});
	
	//post_queue
	cnn.queue('post_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.action =="get"){
			post.getPosts(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}// get Posts
			
			if(message.action =="add"){
				post.addPost(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}// add Posts
			
			
		});
	});
	// User queue
	
	
	
	cnn.queue('interest_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.action =="addinterest"){
			interest.add(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}// get interests
			if(message.action =="get"){
				interest.getInterests(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}
			
			
		});
	});
	cnn.queue('user_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			if(message.action =="search"){
			user.search(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		}// Search
			if(message.action =="add"){
				user.add(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}// add
			
			if(message.action =="confirm"){
				user.confirm(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}// add
			
			if(message.action =="unfriend"){
				user.unfriend(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}// unfriend
			
			if(message.action =="decline"){
				user.decline(message, function(err,res){
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			}// decline
			
			
			
		});
	});
			cnn.queue('about_queue', function(q){
				q.subscribe(function(message, headers, deliveryInfo, m){
					util.log(util.format( deliveryInfo.routingKey, message));
					util.log("Message: "+JSON.stringify(message));
					util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
					if(message.action =="about"){
					about.about(message, function(err,res){
						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
				}// about
					
					if(message.action =="editContacts"){
						about.editContacts(message, function(err,res){
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}// editContacts
					
					
					if(message.action =="addevent"){
						about.addevent(message, function(err,res){
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}// editevent
					
					if(message.action =="addwork"){
						about.addwork(message, function(err,res){
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}// addwork
					
					if(message.action =="addedu"){
						about.addedu(message, function(err,res){
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}// addedu

		});
			});
				
				cnn.queue('friend_queue', function(q){
					q.subscribe(function(message, headers, deliveryInfo, m){
						util.log(util.format( deliveryInfo.routingKey, message));
						util.log("Message: "+JSON.stringify(message));
						util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
						if(message.action =="friendList"){
						friend.friendList(message, function(err,res){
							//return index sent
							cnn.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						});
					}// about
						
						if(message.action =="friendReq"){
							friend.friendReq(message, function(err,res){
								//return index sent
								cnn.publish(m.replyTo, res, {
									contentType:'application/json',
									contentEncoding:'utf-8',
									correlationId:m.correlationId
								});
							});
						}// editContacts
					});
						
	});
});