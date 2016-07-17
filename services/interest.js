var facebookdb = "mongodb://localhost:27017/faceBookdb";
var mongo = require("./mongo"); //Database configuration file 

function add(msg, callback) {

	var res = {};
	console.log("In add Interest  handle request:" + msg.Email);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var evcoll = mongo.collection('interest');
		var interestObj = {
			Email : msg.Email,
			interestName : msg.interestName
		};
		evcoll.insert(interestObj, function(err, interest) {
			if (err) {
				console.log("error insert interest");
				res.code = "401";
				res.value = "Failed insert interest";
				callback(null, res);
			} else {
				console.log("success insert interest");
				res.code = "200";
				res.value = "success insert interest";
				callback(null, res);
			}
		});

	});

};

function getInterests(msg, callback) {
	var res = {};
	var userId = msg.Email;
	console.log("In get Interests handle request:" + msg.Email);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var query = {
			Email : msg.Email
		};
		var fcoll = mongo.collection('interest');
		fcoll.find(query).toArray(function(err, interests) {
			console.log(interests);
			if (err) {
				console.log("Failed get interest");
				res.code = "401";
				res.value = null;
				callback(null, res);
			} else {
				console.log("Succes get interests");
				res.code = "200";
				var json = JSON.stringify({
					"interests" : interests,
				});
				res.value = json;
				callback(null, res);
			}
		});

	});
}
exports.add = add;
exports.getInterests = getInterests;