var MainChat = Parse.Object.extend("MainChat");

var chatObj;
var admin;
var i;

class TODOView {
	static renderPage(){
		var adminPanel = document.createElement("DIV");
		document.body.appendChild(adminPanel);
		adminPanel.className = "chat";
		
		var btnClr10 = document.createElement("BUTTON");
		var t = document.createTextNode("Clear 10 CL");
		btnClr10.appendChild(t);
		btnClr10.id = "btnClr10";
		btnClr10.className = "logOutBtn";
		
		var btnCountChats = document.createElement("BUTTON");
		var t = document.createTextNode("Finds User chats");
		btnCountChats.appendChild(t);
		btnCountChats.id = "btnCountChats";
		btnCountChats.className = "logOutBtn";
		
		adminPanel.appendChild(btnClr10);
		adminPanel.appendChild(btnCountChats);
		
		$("#ai").html("Hello admin");
	}
}

function parseInit(){
	Parse.initialize("myIdIsUnknown", "jsIsMoovie");
	Parse.serverURL = 'http://localhost:8000/parse';
}
function checkAdmin(){
	var queryRole = new Parse.Query(Parse.Role);
	queryRole.equalTo("name", "Administrator");
	
	return queryRole.first().then((result)=>{
		var role = result;
		var adminRel = new Parse.Relation(role, 'users');
		var adminQuery = adminRel.query();
		
		if(!Parse.User.current()){reject();}
		
		adminQuery.equalTo('objectId', Parse.User.current().id);
		return adminQuery.first();
		
	}, (err)=> { reject(); }).then(function(result){
		if(result){
			admin = result;
		}else{
			console.log(result);
			reject();
		}
		
	}, (err)=> { reject(); });
}

function clear10ChatLines(){
	var query = new Parse.Query(MainChat);
	query.limit(10);
	query.find().then(function(list){
		
		for(i=0; i<list.length; i++){
			list[i].destroy();
		}
		
	}).then(function(chatObj){
		$("#ai").html("10 chat Lines are cleared boss");
	});
}

function countUserChats(){
	const query = new Parse.Query("User");
	query.equalTo("username", "teo");
	query.find().then((result)=>{
		console.log(result[0].id);
		Parse.Cloud.run('countUserChats', {user: result[0].id}).then((result)=>{
			$("#ai").html(result);
			console.log("-->", result);
		})
		
	});
}

//_____ACTIONS____________________________________________
window.addEventListener('load', ()=>{
	parseInit();
	checkAdmin().then(()=>{
		TODOView.renderPage();
		
		$("#btnClr10").click(clear10ChatLines);
		$("#btnCountChats").click(countUserChats);
	},
	()=>{
		window.location.replace("/login");
	});
});




