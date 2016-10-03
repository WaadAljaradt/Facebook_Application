var mq_client = require('../rpc/client');
exports.CreateGroup = function(req, res) {
	var GroupName = req.param("GroupName");
	var GroupDesc = req.param("GroupDesc");
	var msg_payload = {
		"GroupName" : GroupName,
		"GroupDesc" : GroupDesc,
		"Email" : req.session.Email,
		"userName" : req.session.FirstName,
		"action" : "create"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("valid Creation");
				res.send({
					"code" : 200,
					"value" : results.value
				});
			} else {
				console.log("Invalid Creation");
				res.send({
					"code" : 401,
					"value" : results.value
				});
			}
		}
	});
};

exports.listGroups = function(req, res) {
	if (req.session.Email == null) {
		res.render("signin");
	} else {
		var msg_payload = {
			"Email" : req.session.Email,
			'action' : "listGroups"
		};
		mq_client.make_request('cgroup_queue', msg_payload, function(err,
				results) {
			console.log(results);
			if (err) {
				throw err;
			} else {

				if (results.code == 200) {
					req.session.groups = results.value;
					console.log(results);
					console.log("valid List");
					res.send({
						"code" : "200"
					});

				} else {
					console.log("Invalid List");
					res.send({
						"code" : "401"
					});
				}
			}
		});
	}

}

exports.SearchGroup = function(req, res) {
	var GroupName = req.param("GroupName");
	if (!GroupName) {
		var theUrl = url.parse(req.url);
		console.log(theUrl);
		var queryObj = queryString.parse(theUrl.query);
		GroupName = queryObj.GroupName;
	}

	var msg_payload = {
		"GroupName" : GroupName,
		"Email" : req.session.Email,
		'action' : "search"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {

			if (results.code == 200) {
				console.log("valid Search");
				var json = JSON.parse(results.value);
				var group = json.group;
				var Role = json.Role;
				console.log(group);
				console.log(Role);
				req.session.GroupName = group.GroupName;
				req.session.GroupDesc = group.GroupDesc;
				res.send({
					"code" : "200"
				});

			} else {
				console.log("Invalid Search");
				res.send({
					"code" : "401"
				});
			}
		}
	});

}

exports.getSearchGroup = function(req, res) {
	if (req.session.Email == null) {
		res.render("signin");
	} else {
		var GroupName = req.param("GroupName");
		if (!GroupName) {
			var theUrl = url.parse(req.url);
			console.log(theUrl);
			var queryObj = queryString.parse(theUrl.query);
			GroupName = queryObj.GroupName;
		}

		var msg_payload = {
			"GroupName" : GroupName,
			"Email" : req.session.Email,
			'action' : "search"
		};
		mq_client.make_request('cgroup_queue', msg_payload, function(err,
				results) {
			console.log(results);
			if (err) {
				throw err;
			} else {

				if (results.code == 200) {
					console.log("valid Search");
					var json = JSON.parse(results.value);
					var group = json.group;
					var Role = json.Role;
					console.log(group);
					console.log(Role);
					req.session.GroupName = group.GroupName;
					req.session.GroupDesc = group.GroupDesc;
					res.render('group', {
						GroupName : req.session.GroupName,
						GroupDesc : req.session.GroupDesc
					});

				} else {
					console.log("Invalid Search");
					res.send({
						"code" : "401"
					});
				}
			}
		});
	}
}

exports.deleteG_request = function(req, res) {
	var GroupName = req.session.GroupName;
	console.log("Delete Group" + GroupName);
	var msg_payload = {
		"GroupName" : GroupName,
		'action' : "deleteGroup"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("valid delete group");
				req.session.GroupName = null;
				req.session.GroupDesc = null;
				res.send({
					"DeleteGroup" : "Success"
				});

			} else {
				console.log("Invalid delete group");
				res.send({
					"DeleteGroup" : "Fail"
				});
			}
		}
	});

}

exports.AddMember = function(req, res) {
	var GroupName = req.session.GroupName;
	var MemberName = req.param("MemberName");
	console.log("Add Member" + MemberName);
	var msg_payload = {
		"GroupName" : GroupName,
		"MemberName" : MemberName,
		'action' : "add"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("Add Member Sucess");
				res.send({
					"addMember" : "Success",
					"value" : results.value
				});

			} else {
				console.log("Invalid Add Member");
				res.send({
					"addMember" : "Fail",
					"value" : results.value
				});
			}
		}
	});

}

exports.deleteMember = function(req, res) {
	var GroupName = req.session.GroupName;
	var MemberName = req.param("MemberName");
	console.log("In Delete Member" + MemberName);
	var msg_payload = {
		"GroupName" : GroupName,
		"MemberName" : MemberName,
		'action' : "deleteMember"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("Delete Member Sucess");
				res.send({
					"deleteMember" : "Success",
					"value" : results.value
				});

			} else {
				console.log("Invalid Delete Member");
				res.send({
					"DeleteMemeber" : "Fail",
					"value" : results.value
				});
			}
		}
	});

}

exports.showMembers = function(req, res) {
	var GroupName = req.session.GroupName;
	//var MemberName = req.param("MemberName");
	console.log("In Show Members");
	var msg_payload = {
		"GroupName" : GroupName,
		'action' : "show"
	};
	mq_client.make_request('cgroup_queue', msg_payload, function(err, results) {
		console.log(results);
		if (err) {
			throw err;
		} else {
			if (results.code == 200) {
				console.log("Show  Members Sucess");

				res.send({
					"value" : results.value
				});

			} else {
				console.log("Invalid Show  Members");
				res.send({
					"show" : "Fail"
				});
			}
		}
	});

}
