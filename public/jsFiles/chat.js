var MainChat = Parse.Object.extend("MainChat");

//basic____variables____
var i;
var j;

var chat = {
	visible: 12,
	lastVisibleDate: "asdasd",
	newestDate: "dadad",
	canGetPast: true
};

var user = {};
var userThis = {};

//End__variables________

class CHATView{
	static renderPage(){
		var mainDiv = document.createElement("DIV");
		
		var headLine = document.createElement("H1");
			headLine.innerHTML="You are safe here";
		var coolText = document.createElement("H2");
			coolText.innerHTML="People need to share their inner thoughts...";
		var coolText1 = document.createElement("H2");
			coolText1.innerHTML="This is the right place";
		mainDiv.appendChild(headLine);
		mainDiv.appendChild(coolText);
		mainDiv.appendChild(coolText1);
		
		var chatWindow = document.createElement("DIV");
			chatWindow.id = "chatWindow"; chatWindow.className = "chatWindow";
		var chatInput = document.createElement("INPUT");
			chatInput.type = "text"; chatInput.id = "chatInput"; 
			chatInput.placeholder="Share your feelings";
		var sendBtn = document.createElement("BUTTON");
			sendBtn.id="sendBtn"; sendBtn.className = "sendBtn"; sendBtn.innerHTML="Send";
		var chatDiv = document.createElement("DIV");
			chatDiv.id = "chatDiv"; chatDiv.className = "chat";
		mainDiv.appendChild(chatDiv);
		chatDiv.appendChild(chatWindow);
		chatDiv.appendChild(chatInput);
		chatDiv.appendChild(sendBtn);
			
		var userPanDiv = document.createElement("DIV");
			userPanDiv.id="userPanDiv"; userPanDiv.className="userPanel";
		var logOutBtn = document.createElement("BUTTON");
			logOutBtn.id="logOutBtn"; logOutBtn.className = "logOutBtn"; logOutBtn.innerHTML="Log Out";
		mainDiv.appendChild(userPanDiv);
		userPanDiv.appendChild(logOutBtn);
		
		document.body.appendChild(mainDiv);
	}
	static clickChatLine(chLiObj){
		var chLi = event.target;
		
		chLi.innerHTML = "Enter new text:";
		var input = document.createElement("INPUT");
		chLi.appendChild(input);
		input.addEventListener("keyup", ()=>{
			if(event.keyCode === 13){
				chLi.innerHTML = user.get("username") + ": " + input.value;
				chLiObj.set("content", input.value);
				chLiObj.save();
			}
		});
	}
	static getChatLine(chLiObj){
		var txt = chLiObj.get("user").get("username");
		txt = txt.concat(": ", chLiObj.get("content"));
		var line = document.createElement("P");
		line.innerHTML = txt;
			
		if(user.id === chLiObj.get("user").id){
			line.addEventListener("click", ()=>{CHATView.clickChatLine(chLiObj);});
		}	
		
		return line;
	}
	
	static renderChat(list){
		chat.newestDate = list[0].get("createdAt");
		for(i=0; i < list.length; i++){
			var line = CHATView.getChatLine(list[i]);
			$("#chatWindow").prepend(line);
		}
		
		chat.lastVisibleDate = list[i-1].get("createdAt");
		scrollDown();
		getChat();
	}
	static addChLi(list){
		for(i=0; i < list.length; i++){
			var line = CHATView.getChatLine(list[i]);
			$("#chatWindow").append(line);
		}
		chat.newestDate = list[0].get("createdAt");
		scrollDown();
	}
	static pastChLi(list){
		for(i=0; i < list.length; i++){
			var line = CHATView.getChatLine(list[i]);
			$("#chatWindow").prepend(line);
		}
		
		if(list.length === 0){
			var line = document.createElement("P");
			line.innerHTML = "__________________BEGINNING___OF___CHAT__________________";
			$("#chatWindow").prepend(line);
			chat.canGetPast = false;
			
		}else
			chat.lastVisibleDate = list[i-1].get("createdAt");
		
		
		document.getElementById("chatWindow").scrollTo(0,10);
	}
}

//________BEGINNING_____FUNCS___________________________________________________
function parseInit(){
	Parse.initialize("myIdIsUnknown", "jsIsMoovie");
	Parse.serverURL = 'http://localhost:8000/parse';
}
function faceBookInit(){
	return new Promise((resolve, reject)=>{
		window.fbAsyncInit = function() {
		Parse.FacebookUtils.init({
		  appId            : '233786763926567',
		  status		   : true,
		  cookie		   : true,
		  autoLogAppEvents : true,
		  xfbml            : true,
		  version          : 'v3.0'
		});
		resolve();
	  };
		
	  (function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));
	  
	});
}
function checkUser(){
  return new Promise((resolve, reject)=>{
	user = Parse.User.current();
	if(!user){
		reject();
		window.location.replace("/login");
	}else{
		if(user.get("authData") === undefined){
			userThis["username"] = user.get("username");
			resolve();
			
		}else if(user.get("authData")["facebook"]){
			FB.api('/me', function(response) {
				userThis["username"] = response.name;
			});
			resolve();
		}
	}
  });
}
function handleParseError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
	  console.log(Parse.User.logOut().then(()=>{
		  window.location.replace('login');
	  }));
		break;
	case 119:
		console.log(Parse.User.logOut().then(()=>{
		  window.location.replace('login');
	  }));
		break;
  }
}
function logOut(){
	Parse.User.logOut().then(()=>{
		window.location.replace('/login');
	});
}
//___END_____BEGINNING____funcs________________________________________________

function sendHandler(){
	var inputVal = $("#chatInput").val();
	if(inputVal === ""){return -1;}
	$("#chatInput").val("");
	
	var chatObj = new MainChat();
	chatObj.save().then((chatObj)=>{
		chatObj.set("user", user);
		chatObj.set("content", inputVal);
		
		return chatObj.save();
		
	}, (chatObj, err)=>{ console.log("Couldnt save ", chatObj, " error-> ", err); });
	
}
function scrollDown(){
	document.getElementById("chatWindow").scrollTo(0,10000);
}
function onScroll(){
  if(chat.canGetPast){
	var pos = $("#chatWindow").scrollTop();
	if((pos === 0) && (chat.visible > 10)){
		console.log("Nai-gore");
		var queryChat = new Parse.Query(MainChat);
		queryChat.include("user");
		
		queryChat.descending("createdAt");
		queryChat.lessThan("createdAt", chat.lastVisibleDate);
		queryChat.limit(5);
		queryChat.find().then((list)=>{
			CHATView.pastChLi(list);
		});
	}
  }
}

function getChat(){
	setTimeout(getChat, 1000);
	var queryChat = new Parse.Query(MainChat);
	queryChat.include("user");
	queryChat.descending("createdAt");

	queryChat.greaterThan("createdAt", chat.newestDate);
	queryChat.find().then((list)=>{
		if(list.length > 0){
			CHATView.addChLi(list);
		}
	}, (err)=>{
		handleParseError(err);
	});
	
}

function setThings(){
	return new Promise((resolve, reject) =>{
		resolve(CHATView.renderPage());
		
	}).then(()=>{
		console.log("events loading");
		$("#chatInput").keypress((e)=>{ if(e.which === 13){sendHandler();} });
		$("#sendBtn").click(sendHandler);
		$("#chatWindow").scroll(onScroll);
		$("#logOutBtn").click(logOut);
		
	}).then(()=>{
		
		return new Promise((resolve, reject) =>{
		  var queryChat = new Parse.Query(MainChat);
		  queryChat.include("user");
		  queryChat.descending("createdAt");
		  queryChat.limit(chat.visible);
		  resolve(queryChat.find());
		});
		
	}).then((list)=>{
		if(list.length > 0){
			CHATView.renderChat(list);
		}
		
	}, (err)=>{
		handleParseError(err);
		
	});
}

//___ACTION___________________________________________________________
window.addEventListener("load", () =>{
  parseInit();
  faceBookInit().then(checkUser).then(()=>{
	  setThings();
  })
  
});