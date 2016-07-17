var mq_client = require('../rpc/client');

exports.about = function (req,res) { 
	var Email = req.session.Email;
	var msg_payload = { "Email": Email,"action":"about"}; 
	mq_client.make_request('about_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else  {
				var json = JSON.parse(results.value);// with all the good stuff here from jsob
				req.session.work = json.work;
				req.session.contacts = json.contactInfo;
				req.session.event = json.event;
				req.session.education = json.education;
				
				res.render("about",{"work" :json.work,"contacts":json.contactInfo,"event":json.event ,"education":json.education});
				
			}
		});
	};
	
	
exports.contacts = function (req,res) { 
	console.log(req.session.contacts);
		
res.render("contacts",{"data":req.session.contacts});
					
};	

exports.editContacts = function (req,res) { 
	
	var phoneNumber = req.param("phoneNumber");
	var currentCity = req.param("currentCity");
	var dateOfBirth = req.param("dateOfBirth");
	var emailc = req.param("email");
	var Email = req.session.Email;
	console.log(phoneNumber );
	
	var msg_payload = { "Email":Email, "emailc": emailc,"dateOfBirth":dateOfBirth,"currentCity":currentCity, "phoneNumber":phoneNumber, "action":"editContacts"}; 
	mq_client.make_request('about_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {   
				if(results.code == 200){     
					console.log("valid editContacts"); 
					res.send({"code":"200"});      
					}    else {             
						console.log("Invalid editContacts");     
						res.send({"code":"401"});    
						}  
				
		}
	});
};
	
	
exports.event = function (req,res) { 
res.render("event",{"data":req.session.event});
					
};	

	
	

	
	
exports.addevent = function (req,res) { 
	
	var eventname = req.param("eventname");
	var evenDisc = req.param("evenDisc");
	var eventdate = req.param("eventdate");
	var eventPlace = req.param("eventPlace");
	var Email = req.session.Email;
	console.log(eventname );
	
	var msg_payload = { "Email":Email, "eventdate": eventdate,"eventPlace":eventPlace,"evenDisc":evenDisc, "eventname":eventname, "action":"addevent"}; 
	mq_client.make_request('about_queue',msg_payload, function(err,results){     
		console.log(results);   
		if(err){    
			throw err;   
			}   else    {   
				if(results.code == 200){     
					console.log("valid addevent"); 
					res.send({"code":"200"});      
					}    else {             
						console.log("Invalid addevent");     
						res.send({"code":"401"});    
						}  
				
		}
	});
};

// work 

exports.work = function (req,res) { 
	res.render("work",{"data":req.session.work});
						
	};	

		
		
exports.addwork = function (req,res) { 
		
		var position = req.param("position");
		var company = req.param("company");
		var jobDisc = req.param("jobDisc");
		var startdate = req.param("startdate");
		var endDate = req.param("endDate");
		var Email = req.session.Email;
		console.log("In post add WorK");
		
		var msg_payload = { "Email":Email, "position": position,"company":company,"jobDisc":jobDisc, "startdate":startdate,"endDate":endDate, "action":"addwork"}; 
		mq_client.make_request('about_queue',msg_payload, function(err,results){     
			console.log(results);   
			if(err){    
				throw err;   
				}   else    {   
					if(results.code == 200){     
						console.log("valid addwork"); 
						res.send({"code":"200"});      
						}    else {             
							console.log("Invalid addwork");     
							res.send({"code":"401"});    
							}  
					
			}
		});
	};
	
	
	
	// education 
	
	
	exports.edu = function (req,res) { 
		res.render("education",{"data":req.session.education});
							
		};	

			
			

			
			
		exports.addedu = function (req,res) { 
			
			var major = req.param("major");
			var University = req.param("University");
			var startdate = req.param("startdate");
			var endDate = req.param("endDate");
			var Email = req.session.Email;

			var msg_payload = { "Email":Email, "major": major,"University":University,"startdate":startdate, "endDate":endDate, "action":"addedu"}; 
			mq_client.make_request('about_queue',msg_payload, function(err,results){     
				console.log(results);   
				if(err){    
					throw err;   
					}   else    {   
						if(results.code == 200){     
							console.log("valid addedu"); 
							res.send({"code":"200"});      
							}    else {             
								console.log("Invalid addedu");     
								res.send({"code":"401"});    
								}  
						
				}
			});
		};
	
	

