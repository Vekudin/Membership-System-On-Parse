function parseInit(){
	Parse.initialize("myIdIsUnknown", "jsIsMoovie");
	Parse.serverURL = 'http://localhost:8000/parse';
}
function checkUser(){
	if(user = Parse.User.current()){
		window.location.replace("/index");
	}
}
function facebookLogin(){
  Parse.FacebookUtils.logIn("user_likes, email", {
	  success: function(user) {
		if (!user.existed()) {
		  $("#ai").html("Redirecting");
		  Parse.Cloud.run('hello').then(function(thing) {
			console.log(thing);
		  });
		  window.location.replace("/index");
		  
		} else {
		  $("#ai").html("Redirecting");
		  window.location.replace("/index");
		}
	  },
	  error: function(user, error) {
		alert("User cancelled the Facebook login or did not fully authorize.");
	  }
  });
  
}
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function authenticate(){
	var uNameVal = document.getElementById("uNameIn").value;
	var passVal = document.getElementById("passIn").value;
	
	Parse.User.logIn(uNameVal, passVal, {
		success: function(user){
			document.getElementById("ai").innerHTML = "Redirecting";
			window.location.replace("/index");
		},
		error: function(user, error){
			document.getElementById("ai").innerHTML = error.message;
		}
	});
}


//________ACTIONS______________
window.addEventListener('load', ()=>{
	parseInit();
	checkUser();
	document.getElementById("loginBtn").addEventListener("click", authenticate);
	document.getElementById("loginFbBtn").addEventListener("click", facebookLogin);
	document.getElementById("uNameIn").addEventListener("keyup", function(event){
		if(event.keyCode === 13){authenticate();}
	});
	document.getElementById("passIn").addEventListener("keyup", function(event){
		if(event.keyCode === 13){authenticate();}
	});
	
});