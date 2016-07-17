var facebookdb = "mongodb://localhost:27017/faceBookdb";
//var UsersURL = "mongodb://localhost:27017/users"; 
var mongo = require("./mongo"); //Database configuration file 

function friendList(msg, callback) {
	var userId = msg.Email;
	var res = {};
	console.log("In friendList  handle request:" + msg.Email);
	var query = {
		$or : [ {
			userId_1 : userId
		}, {
			userId_2 : userId
		} ],
		accepted : 1
	};
	var fcoll = mongo.collection('friend');
	fcoll.find(query).toArray(function(err, friend) {
		console.log(friend);
		var array = [];
		var value;
		for (i = 0; i < friend.length; i++) {
			if (friend[i].userId_2 == userId)
				value = friend[i].userId_1;
			else
				value = friend[i].userId_2;
			array.push(value);
		}
		console.log(array);
		var query = {
			Email : {
				$in : array
			}
		}
		var coll = mongo.collection('users');
		coll.find(query).toArray(function(err, user) {
			console.log(user);
			console.log("Succes about page ");
			res.code = "200";
			res.value = user;
			callback(null, res);

		});
	});
};
function friendReq(msg, callback) {

	var userId = msg.Email;
	var res = {};
	console.log("In friendReq  handle request:" + msg.Email);
	var query = {
		$or : [ {
			userId_1 : userId
		}, {
			userId_2 : userId
		} ],
		accepted : 0,
		request : 1
	};
	var fcoll = mongo.collection('friend');
	fcoll.find(query).toArray(function(err, friend) {
		console.log(friend);
		var array = [];
		var value;
		for (i = 0; i < friend.length; i++) {
			if (friend[i].userId_2 == userId)
				value = friend[i].userId_1;
			else
				value = friend[i].userId_2;
			array.push(value);
			console.log("hey");
		}
		console.log(array);
		var query = {
			Email : {
				$in : array
			}
		}
		var coll = mongo.collection('users');
		coll.find(query).toArray(function(err, user) {
			console.log(user);
			console.log("Succes about page ");
			res.code = "200";
			res.value = user;
			callback(null, res);

		});
	});
};

exports.friendReq = friendReq;
exports.friendList = friendList;