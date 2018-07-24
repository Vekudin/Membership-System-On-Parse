var validate = require('validate.js');
var i;

Parse.Cloud.beforeSave(Parse.User, (req, res) => {
  var qUser = req.object;
  if(!(qUser.get("authData")===undefined)){
	    if(req.object.isNew()){
			
			var userACL = new Parse.ACL();
			userACL.setPublicReadAccess(false);
			userACL.setPublicWriteAccess(false);
			userACL.setRoleReadAccess("Basic", true);
				
			qUser.setACL(userACL);
			res.success();
		}else{

			console.log(req.object.get("username"), "is updated");
			res.success();
		}
	  
	  res.success();
  }else{
	  console.log(qUser.get("authData"));
	  user.validation(qUser.get("email"), qUser.get("password")).then(()=>{
		if(req.object.isNew()){
			var userACL = new Parse.ACL();
			userACL.setPublicReadAccess(false);
			userACL.setPublicWriteAccess(false);
			userACL.setRoleReadAccess("Basic", true);
				
			qUser.setACL(userACL);
			res.success();
				
		}else{
			//if(req.object.get("username") != req.object.get("email")){
			//res.error("You are doing illegal stuff");
			//}else{
			console.log(req.object.get("username"), "is updated");
			res.success();
			//}
		}
			
	  }).catch(res.error)
  }
});

Parse.Cloud.afterSave(Parse.User, (req) =>{
	const user = req.object;
	
	if(!user.existed()){
		
		var roleQuery = new Parse.Query(Parse.Role);
		roleQuery.equalTo("name", "Basic");
		roleQuery.first().then((result)=>{
			result.getUsers().add(req.object);
			result.save();
			
		});
	}
});

Parse.Cloud.beforeSave("MainChat", (req, res)=>{
	
	if(req.user.get("authData") != undefined){
		user.sessionPenetration(req, res);
	}
	
	if(req.object.isNew()){
		var chLi = req.object;
		
		var chLiACL = new Parse.ACL();
		chLiACL.setRoleReadAccess("Basic", true);
		chLiACL.setRoleWriteAccess("Administrator", true);
		chLiACL.setReadAccess(req.user.id, true);
		chLiACL.setWriteAccess(req.user.id, true);
		chLi.setACL(chLiACL);
			
		res.success();

	}else{
		res.success();
	}
});

//______________________DEFINED__CLOUD__FUNCTIONS_____________________________________________
Parse.Cloud.define("hello", (request, response)=>{
    let access_token = request.user.get('authData').facebook.access_token;
	
    Parse.Cloud.httpRequest({
        url: 'https://graph.facebook.com/v3.0/me?fields=id,gender,name,email&access_token=' + access_token
	}).then(function(result) { 
        console.log(result);
		var wtf = result.data;
		console.log("____________________________________");
		console.log(wtf);
		console.log("_________________|||________________");
		
		request.user.set("username", wtf.name);
		request.user.save(null,{useMasterKey:true});
		
		response.success("dawe");
		
    }, function(error) { 
		response.error("newe");
        console.log(error);
    })
 
});

Parse.Cloud.define("countUserChats", (req, res)=>{
	const query = new Parse.Query("MainChat");
	query.include("user");

	query.find({useMasterKey:true}).then((list)=>{
		var count = 0, i;
		for(i=0; i < list.length; i++){
			if(list[i].get("user").id === req.params.user){
				count++;
			}
		}
		res.success(count);
		
	}).catch(()=>{
		res.error("User lokup failed");
		
	});
});

//______________________MY___FUNCTIONS___________________________________________________

var user = {
	validation: function(email, pass){
	  return new Promise((resolve, reject)=>{
		var constraints = {
			from:{
			  email: {
				message: "The email you entered is not valid"
			  }
			},
			password: {
				presence: true,
				length: {
					minimum: 3,
					message: "Your password must be at least 5 characters"
				}
			}
		}
		var checkObj = {from: email, password: pass};
		validObj = validate(checkObj, constraints);

		if (validObj) {
			reject(validObj);
		} else {
			resolve();
		}
      });
	},
	
	sessionPenetration: function(req, res){
		console.log("___________________________");
		console.log(req.user);
		let access_token = req.user.get('authData').facebook.access_token;
		
		Parse.Cloud.httpRequest({
			url:'https://graph.facebook.com/v3.0/me?fields=id,gender,name,email&access_token='+access_token
		}).then((result)=>{
			var wtf = result.data;
			console.log(wtf);
			
		}, (result)=>{
			console.log("Error with checking user ability ");
			//console.log(result);
			console.log("___________________________________________________");
			console.log('----->', req.user.id);
			
			const querySes = new Parse.Query("_Session");
			querySes.include("user");
			
			querySes.find({useMasterKey:true}).then((data)=>{
				for(i=0; i<data.length; i++){
					if(data[i].get("user").id === req.user.id){
						console.log(data[i]);
						data[i].destroy({useMasterKey:true}).then((obj)=>{
							res.error("ko stana weee");
							
						}, (err)=>{
							res.error();
							
						});
					}
				}
			});
		});
	}
};