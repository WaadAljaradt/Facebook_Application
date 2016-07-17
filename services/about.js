var facebookdb = "mongodb://localhost:27017/faceBookdb"; 
//var UsersURL = "mongodb://localhost:27017/users"; 
var mongo = require("./mongo"); //Database configuration file 



function about(msg, callback){  
	
	var res = {};  
	console.log("In about  handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			 var query = {Email:msg.Email};
			var ecoll = mongo.collection('edu'); 
			ecoll.find(query).toArray( 
					function(err, education){
					console.log("education");
					console.log(education);
					var wcoll = mongo.collection('work');
				
					wcoll.find(query).toArray(
							function(err, work){
					console.log("work");
					console.log(work);
					
					var pcoll = mongo.collection('place');
					
					pcoll.find(query).toArray(
							function(err, place){
					console.log("place");
					console.log(place);
					
					
					var ccoll = mongo.collection('contactInfo');
					
					ccoll.findOne(query,
							function(err, contactInfo){
					console.log("contactInfo");
					console.log(contactInfo);
					
					var evcoll = mongo.collection('event');
					
					evcoll.find(query).toArray(
							function(err, event){
					console.log("event");
					console.log(event);

					console.log("Succes about page ");
					res.code = "200";  
					var json = JSON.stringify({ 
						education: education, 
					    work: work,
					    event :event,
					    place :place,
					    contactInfo:contactInfo   
					});
					res.value = json;
					callback(null, res);
							});
							});
							});
							});
					});
		});
};
					
	
	
function editContacts(msg, callback){  
	
	var res = {};  
	console.log("In editContacts  handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			 var query = {Email:msg.Email};
			var ccoll = mongo.collection('contactInfo'); 
			ccoll.findOne(query ,
					function(err, contactInfo){
					if(contactInfo){//update
						var objUpdate = {};

						if (msg.phoneNumber) objUpdate.phoneNumber =msg.phoneNumber;
						if (msg.currentCity) objUpdate.currentCity =msg.currentCity;
						if (msg.dateOfBirth) objUpdate.dateOfBirth =msg.dateOfBirth;
						if (msg.emailc) objUpdate.emailc =msg.emailc;
						var update ={$set:objUpdate};
						ccoll.update(query,update, function(err,group){
							if(err){
				        		console.log("error update ContactInfo");
				        		res.code = "401";   
								res.value = "Failed update ContactInfo"; 
								callback(null, res);
				        	}else{
				        	console.log("success update ContactInfo" );
				        	res.code = "200";   
							res.value = "success update ContactInfo";
							callback(null, res);
				        	}
							
						});
					}else{//insert
					var contactInfoObj = {Email: msg.Email, phoneNumber: msg.phoneNumber,currentCity:msg.currentCity,dateOfBirth:msg.dateOfBirth,emailc:msg.emailc};
					ccoll.insert(contactInfoObj, function(err,contact){
						if(err){
			        		console.log("error insert ContactInfo");
			        		res.code = "401";   
							res.value = "Failed insert ContactInfo"; 
							callback(null, res);
			        	}else{
			        	console.log("success insert ContactInfo" );
			        	res.code = "200";   
						res.value = "success insert ContactInfo";
						callback(null, res);
			        	}
						
						
					});
					}
					});
		});
};
		
		

function addevent(msg, callback){  
	
	var res = {};  
	console.log("In addevent  handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			var evcoll = mongo.collection('event'); 
			var eventObj = {Email: msg.Email, eventdate: msg.eventdate,eventdate:msg.eventdate,eventPlace:msg.eventPlace,evenDisc:msg.evenDisc,eventname:msg.eventname};
			evcoll.insert(eventObj, function(err,event){
						if(err){
			        		console.log("error insert addevent");
			        		res.code = "401";   
							res.value = "Failed insert addevent"; 
							callback(null, res);
			        	}else{
			        	console.log("success insert addevent" );
			        	res.code = "200";   
						res.value = "success insert addevent";
						callback(null, res);
			        	}
									});
			
					});

};	//work

function addwork(msg, callback){  
	
	var res = {};  
	console.log("In addwork  handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			var wcoll = mongo.collection('work'); 
			var workObj = {Email: msg.Email, position: msg.position,company:msg.company,jobDisc:msg.jobDisc,startdate:msg.startdate,endDate:msg.endDate};
			wcoll.insert(workObj, function(err,work){
						if(err){
			        		console.log("error insert addwork");
			        		res.code = "401";   
							res.value = "Failed insert addwork"; 
							callback(null, res);
			        	}else{
			        	console.log("success insert addwork" );
			        	res.code = "200";   
						res.value = "success insert addwork";
						callback(null, res);
			        	}
									});
			
					});

};


//edu

function addedu(msg, callback){  
	
	var res = {};  
	console.log("In addedu  handle request:"+ msg.Email); 
		mongo.connect(facebookdb, function(){ 
			console.log('Connected to mongo at: ' + facebookdb);
			var ecoll = mongo.collection('edu'); 
			var edObj = {Email: msg.Email, major: msg.major,University:msg.University,startdate:msg.startdate,endDate:msg.endDate};
			ecoll.insert(edObj, function(err,work){
						if(err){
			        		console.log("error insert addedu");
			        		res.code = "401";   
							res.value = "Failed insert addedu"; 
							callback(null, res);
			        	}else{
			        	console.log("success insert addedu" );
			        	res.code = "200";   
						res.value = "success insert addedu";
						callback(null, res);
			        	}
									});
			
					});

};
					
exports.addevent=addevent;	

exports.addedu=addedu;
exports.addwork=addwork;
exports.about =about;
exports.editContacts =editContacts;