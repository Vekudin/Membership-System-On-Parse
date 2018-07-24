function parseInit(){
	Parse.initialize("myIdIsUnknown", "jsIsMoovie");
	Parse.serverURL = 'http://localhost:8000/parse';
}

function register(){
	var emailVal = document.getElementById("emailIn").value;
	var passVal = document.getElementById("passIn").value;
	var passConf = document.getElementById("passConfIn").value;
	
	var user = new Parse.User();
	user.set("username", emailVal);
	user.set("email", emailVal);
	user.set("password", passVal);
	
	if(passVal != passConf){
		$("#ai").html("Passwords do not match !");
	}else{
		console.log("wtfff");
		user.signUp(null).then((user)=>{
			$("#ai").html("Welcome my firend !");
			window.location.replace("/index");
			
		}, (e)=>{
			$("#ai").html(validation(e));
		});
	  
	}
}

function validation(e){
	var validMsg="";
	
	if(e.message['from']){
		validMsg = JSON.stringify(e.message['from']);
		validMsg = validMsg.slice(6, validMsg.length-2);
		
		
	}else if(e.message['password']){
		validMsg = JSON.stringify(e.message['password']);
		validMsg = validMsg.slice(10, validMsg.length-2);
	}
	else{
		validMsg = JSON.stringify(e.message);
	}
	return validMsg;
}

window.addEventListener('load', ()=>{
	parseInit();
	document.getElementById("regBtn").addEventListener('click', register);
	document.getElementById("emailIn").addEventListener("keyup", function(event){
		if(event.keyCode === 13){register();}
	});
	document.getElementById("passIn").addEventListener("keyup", function(event){
		if(event.keyCode === 13){register();}
	});
	document.getElementById("passConfIn").addEventListener("keyup", function(event){
		if(event.keyCode === 13){register();}
	});
});