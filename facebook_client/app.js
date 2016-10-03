
/**
 * Module dependencies.
 */

var express = require('express');
var expressSession = require("express-session"); 

var user = require('./routes/user');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var home = require('./routes/home');
var group = require('./routes/group');
var about = require('./routes/about');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(expressSession({ secret: 'cmpe273_teststring', resave: false, //don't save session if unmodified 
	saveUninitialized: false, // don't create session until something stored 
	duration: 30 * 60 * 1000, 
	activeDuration: 5 * 60 * 1000, 
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/signin',home.sign_in);
app.post('/signin', home.after_sign_in);
app.post('/signup', home.after_sign_up);
app.post('/logout', home.after_sing_out);

app.get('/profile', home.profile);
app.get('/friendReq', home.friendReq);
app.get('/friendList', home.friendList);
app.get('/fail_login', function(req,res){
  res.render('signin');
});
app.get('/createGroup', function(req,res){
	if(req.session.Email==null){
		res.render("signin");
	}else{
	  res.render('createGroup');
	}
	});
app.get('/groups', function(req,res){
	if(req.session.Email==null){
		res.render("signin");
	}else{
	console.log("groups"+ req.session.groups);
	  res.render('ListGroups', {groups:req.session.groups});
	}
});
app.post('/SearchGroup',group.SearchGroup);
app.get('/SearchGroup',group.getSearchGroup);
app.post('/createGroup',group.CreateGroup);
app.get('/group', function(req,res){
	if(req.session.Email==null){
		res.render("signin");
	}else{
	  res.render('group',{GroupName: req.session.GroupName, GroupDesc: req.session.GroupDesc});
	}
});
app.get('/listGroups',group.listGroups);

app.post('/deletegroup',group.deleteG_request);
app.post('/AddMember',group.AddMember);
app.post('/deleteMember',group.deleteMember);

app.post('/showMembers',group.showMembers);
app.post('/SearchUser',user.SearchUser);
app.get('/SearchUser',user.getSearchUser);
app.post('/Addfriend',user.Addfriend);
app.post('/confirm',user.confirm);
app.post('/decline',user.decline);
app.post('/unfriend',user.unfriend);
app.post('/addPost',home.addPost);
app.post('/addinterest',home.addinterest);
app.get('/about',about.about);
app.get('/contacts',about.contacts);
app.post('/editContacts',about.editContacts);
app.get('/event',about.event);
app.post('/addevent',about.addevent);
app.get('/work',about.work);
app.post('/addwork',about.addwork);
app.get('/edu',about.edu);
app.post('/addedu',about.addedu);
app.get('/interest',home.interest);


app.get('/user',function(req,res){ 
	var json = JSON.parse(req.session.userInfo);
	console.log(json);
	res.render("user",{"name":json.name,"flag":json.flag,"request":json.request,"sender":json.sender, "posts":json.posts});
				}
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




