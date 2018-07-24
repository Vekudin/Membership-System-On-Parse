var path = require('path');
var express = require('express');
var validate = require('validate.js');
var ParseNode = require('parse/node');
var ParseServer = require('parse-server').ParseServer;

//______PARSE______SERVER________________________
var urlDB = 'mongodb://localhost:27017/dev';
var api = new ParseServer({
  databaseURI: urlDB, 
  cloud: './cloud/main.js', 
  appId: 'myIdIsUnknown',
  masterKey: 'lifeIsReal', 
  javascriptKey: 'jsIsMoovie',
  serverURL: 'http://localhost:8000/parse',
  clientKey: 'yourGrandmaAsTree',
  liveQuery: {
	classNames: ["Chats"]
  }
});

const app = express();

app.use('/parse', api);

//____FOLDERS___OF___SERVER______________________________
app.use('/public', express.static(__dirname + '/public'));
app.use('/jsFiles', express.static(__dirname + '/public/jsFiles'));
app.use('/cssFiles', express.static(__dirname + '/public/cssFiles'));

//____________BASE___________________________________________________________________________________________


//________POST___&___GET_______________________________


//_______PAGES___________________________________________________________
app.get('/admin', function(req, res){

	res.sendFile("admin.html", {root: path.join(__dirname, "/public")});
});
app.get('/index', function(req, res){
	
	res.sendFile("index.html", {root: path.join(__dirname, "/public")});
});
app.get('/login', function(req, res){
	
	res.sendFile("login.html", {root: path.join(__dirname, "/public")});
});
app.get('/register', function(req, res){

	res.sendFile("register.html", {root: path.join(__dirname, "/public")});
});
app.get('/', function(req, res){
	res.redirect('/login');
});
//_________END___BASE________________________________________________________________________________________



//_______________________________________________________________________________
app.listen(8000, function(){
	console.log("server listening at port: 8000");
});