var facebookdb = "mongodb://localhost:27017/faceBookdb";
// var UsersURL = "mongodb://localhost:27017/users";
var mongo = require("./mongo"); // Database configuration file

function create_request(msg, callback) {
	var res = {};
	console.log("In create Group handle request:" + msg.GroupName);
	mongo
			.connect(
					facebookdb,
					function() {
						console.log('Connected to mongo at: ' + facebookdb);
						var query = {
							GroupName : msg.GroupName
						};
						var groupObject = {
							GroupName : msg.GroupName,
							GroupDesc : msg.GroupDesc
						};
						var groups_usersObject = {
							Email : msg.Email,
							userName : msg.userName,
							GroupName : msg.GroupName,
							Role : '1'
						};
						var coll = mongo.collection('groups');
						coll
								.findOne(
										query,
										function(err, group) {
											if (group) {
												console.log(group);
												console
														.log("Group already exists Error"
																+ group);
												res.code = "401";
												res.value = "Group already exists";
												callback(null, res);
											} else {
												// create the new user
												coll
														.insert(
																groupObject,
																function(err,
																		group) {
																	if (!err) {
																		var groupd_userscoll = mongo
																				.collection('groups_users');
																		groupd_userscoll
																				.insert(
																						groups_usersObject,
																						function(
																								err,
																								group) {
																							if (!err) {

																								console
																										.log("success Create of Groupe");
																								res.code = "200";
																								res.value = "success Create of Groupe";
																								callback(
																										null,
																										res);
																							} else {
																								console
																										.log("error");
																								res.code = "401";
																								res.value = "Failed Creation of Group";
																								callback(
																										null,
																										res);
																							}

																						});

																	} else {
																		console
																				.log("error");
																		res.code = "401";
																		res.value = "Failed Creation of Group";
																		callback(
																				null,
																				res);
																	}

																});
											}
										});
					});
};

function search_request(msg, callback) {
	var res = {};
	console.log("In Search Group handle request:" + msg.GroupName);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var query = {
			GroupName : msg.GroupName
		};
		var coll = mongo.collection('groups');
		coll.findOne(query, function(err, group) {
			if (group) {
				console.log("Search Group :");
				console.log(group);
				var groups_userscoll = mongo.collection('groups_users');
				var groups_userquery = {
					Email : msg.Email,
					GroupName : msg.GroupName
				};
				groups_userscoll.findOne(groups_userquery, function(err,
						group_user) {
					console.log(group_user);
					console.log("Succes Search group");
					res.code = "200";
					var json = JSON.stringify({
						Role : group_user.Role,
						group : group,
					});
					res.value = json;
					callback(null, res);
				});
			} else {
				console.log("No Result for group");
				res.code = "401";
				res.value = "No group";
				callback(null, res);
			}
		});
	});
};

function listGroups(msg, callback) {
	var res = {};
	console.log("In listGroups Group handle request:" + msg.Email);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var query = {
			Email : msg.Email
		};
		var coll = mongo.collection('groups_users');
		coll.find(query).toArray(function(err, results) {
			console.log(results);
			if (results) {
				console.log("Succes ListGroups");
				res.code = "200";
				res.value = results;
				callback(null, res);

			} else {
				console.log("No Result for ListGroups");
				res.code = "401";
				res.value = "No results";
				callback(null, res);
			}

		});

	});
};

function deleteG_request(msg, callback) {
	var res = {};
	console.log("In Delete Group handle request:" + msg.GroupName);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var query = {
			GroupName : msg.GroupName
		};
		var coll = mongo.collection('groups');
		coll.remove(query, function(err) {
			if (err) {
				console.log("Error Delete group");
				res.code = "401";
				res.value = "Error";
				callback(null, res);

			} else {
				var query = {
					GroupName : msg.GroupName
				};
				var groups_usercoll = mongo.collection('groups_users');
				groups_usercoll.remove(query, function(err) {
					if (err) {
						console.log("Error Delete group In groups_users ");
						res.code = "401";
						res.value = "Error";
						callback(null, res);

					} else {

						console.log("Succes Delete group");
						res.code = "200";
						res.value = "success Delete";
						callback(null, res);

					}
				});
			}
		});

	});
};

function AddMember(msg, callback) {
	var res = {};
	console.log("In Add member handle request:" + msg.MemberName);

	mongo
			.connect(
					facebookdb,
					function() {
						console.log('Connected to mongo at: ' + facebookdb);
						var Userquery = {
							FirstName : msg.MemberName
						};

						// var query = {GroupName:msg.GroupName,
						// Email:msg.Email};
						// var groupObject = {Email: msg.Email, GroupName:
						// msg.GroupName, GroupDesc:
						// msg.GroupDesc,Role:msg.Role};
						var userscoll = mongo.collection('users');
						userscoll
								.findOne(
										Userquery,
										function(err, user) {
											if (user) {
												var groups_userquery = {
													GroupName : msg.GroupName,
													Email : user.Email
												};
												console
														.log(" Member  Exsit in Users ");
												var groups_userscoll = mongo
														.collection('groups_users');
												groups_userscoll
														.findOne(
																groups_userquery,
																function(err,
																		group) {
																	if (group) {

																		console
																				.log(group);
																		console
																				.log("Member already Added Error");
																		res.code = "401";
																		res.value = "Member already Added Error";
																		callback(
																				null,
																				res);
																	} else {
																		// Insert
																		// add
																		// Member
																		var groups_usersObject = {
																			Email : user.Email,
																			GroupName : msg.GroupName,
																			Role : '0',
																			userName : user.FirstName
																		};
																		groups_userscoll
																				.insert(
																						groups_usersObject,
																						function(
																								err,
																								group) {
																							if (err) {
																								console
																										.log("error");
																								res.code = "401";
																								res.value = "Failed Add Member To Group";
																								callback(
																										null,
																										res);
																							} else {
																								console
																										.log("success Add Member to Group");
																								res.code = "200";
																								res.value = "success Add Member to Group";
																								callback(
																										null,
																										res);
																							}

																						});
																	}
																});
											} else {
												console
														.log(" Error :User Doesnt Exsit");
												res.code = "401";
												res.value = "User Doesnt Exsit";
												callback(null, res);
											}

										});
					});
};

function showMembers(msg, callback) {
	var res = {};
	console.log("In Show Members Group handle request:" + msg.GroupName);
	mongo.connect(facebookdb, function() {
		console.log('Connected to mongo at: ' + facebookdb);
		var query = {
			GroupName : msg.GroupName
		};
		var coll = mongo.collection('groups_users');
		coll.find(query).toArray(function(err, results) {
			console.log(results);
			if (results) {
				console.log("Succes showMember group");
				res.code = "200";
				res.value = results;
				callback(null, res);

			} else {
				console.log("No Result for showMember");
				res.code = "401";
				res.value = "No results";
				callback(null, res);
			}

		});

	});
};

function deleteMember(msg, callback) {
	var res = {};
	console.log("In Delete Member handle request:" + msg.MemberName);
	mongo
			.connect(
					facebookdb,
					function() {
						console.log('Connected to mongo at: ' + facebookdb);
						var query = {
							FirstName : msg.MemberName
						};
						var coll = mongo.collection('users');
						coll
								.findOne(
										query,
										function(err, user) {
											if (err || user == null) {
												console
														.log("Error User Doesnt Exist");
												res.code = "401";
												res.value = "Error User Doesnt Exist";
												callback(null, res);

											} else {
												var query = {
													GroupName : msg.GroupName,
													Email : user.Email
												};
												var groups_usercoll = mongo
														.collection('groups_users');
												groups_usercoll
														.findOne(
																query,
																function(err,
																		results) {
																	if (err
																			|| results == null) {
																		console
																				.log("Not a member of group ");
																		res.code = "401";
																		res.value = "Not a member of group";
																		callback(
																				null,
																				res);

																	} else if (results.Role == '1') {
																		console
																				.log("Error User is Admin ");
																		res.code = "401";
																		res.value = "Error User is Admin";
																		callback(
																				null,
																				res);
																	} else {

																		groups_usercoll
																				.remove(
																						query,
																						function(
																								err,
																								results) {

																							if (err) {
																								console
																										.log("Error Delete Member  In groups_users ");
																								res.code = "401";
																								res.value = "Error";
																								callback(
																										null,
																										res);

																							} else {
																								console
																										.log(results);

																								console
																										.log("Succes Delete Member");
																								res.code = "200";
																								res.value = "success Delete Member";
																								callback(
																										null,
																										res);

																							}
																						});
																	}
																});
											}
										});

					});
};

exports.create_request = create_request;
exports.search_request = search_request;
exports.deleteG_request = deleteG_request;
exports.AddMember = AddMember;
exports.showMembers = showMembers;
exports.deleteMember = deleteMember;
exports.listGroups = listGroups;
