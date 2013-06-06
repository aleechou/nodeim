// JavaScript Document

var nodeim = {};
nodeim.socket = null;
nodeim.chatWindowArr = [];
nodeim.server = "http://zj001.wonei.com:8765";

/**
 * connect
 */
nodeim.connect = function (){
	
	if( nodeim.socket == null ){
		
		nodeim.socket = io.connect(nodeim.server) ;
		nodeim.socket.on('message', function (data) {
			console.log("收到消息：",data);
			
			switch(data.type)
			{
				case 'request-subscription' :
					
//					alert("<p>"+data.from.username+"(id:"+data.from.id+") 请求加你为好友："+data.message+"</p>")
					if(window.confirm("<>"+data.from.username+"(id:"+data.from.id+") 请求加你为好友："+data.message+"<>")){
		                 //alert("确定");
						nodeim.replyFriend({to:data.from.id  ,refuse:0},function(){
							nodeim.friends();
						});
		                return true;
		              }else{
		                 //alert("取消");
						nodeim.replyFriend({to:data.from.id  ,refuse:1});
		                return false;
		             } 
					break ;
				case 'refuse' :
					alert("<>"+data.from.username+"(id:"+data.from.id+") 拒绝了你的好友请求："+data.message+"<>") ;
					break ;
				case 'agree' :
					alert("<>"+data.from.username+"(id:"+data.from.id+") 同意了你的好友请求："+data.message+"<>") ;
					
					nodeim.createUser(data.from);
			    	nodeim.startDraggable();
					break ;

				default :
					
					var _isWin = false;
					for(var i=0;i<nodeim.chatWindowArr.length;i++){
						if( nodeim.chatWindowArr[i].id == data.from.id){
							nodeim.chatWindowArr[i].window.call("onMessage",[data]);
							nodeim.chatWindowArr[i].window.show()
							_isWin = true;
						}
					}
					
					if(_isWin == false){
						openChatWindow(data.from.id,data.from.username,function(obj){
							obj.call("onMessage",[data]);
						});
						
					}
					break ;
			}
		});
		nodeim.socket.on('connect',function(){
			$("#messageoutput").append("<p style='color:red'>已经连接到服务器</p>") ;
		}) ;
		nodeim.socket.on('presence',function(doc){
			console.log('presence:',doc) ;
			
			jQuery(".wMainUserItem").each(function(i){
				
				if( jQuery(this).attr("uid") == doc.id){
					
					if( doc.presence == "在线"){
						jQuery(this).find("[class='zz']").hide();
					}else{
						jQuery(this).find("[class='zz']").show();
					}
					
					nodeim.reOrder();
				}
			})
			
			
			
			//onlineList
			//presence
			//wMainUserItem
		}) ;
		nodeim.socket.on('room.join',function(doc){
			console.log('room.join:',doc) ;
		}) ;
		nodeim.socket.on('room.leave',function(doc){
			console.log('room.leave:',doc) ;
		}) ;
		
		nodeim.socket.on('upload',function(doc){
			
			nodeim.localUser.facePath = nodeim.server + doc.url;
			
			nodeim.profile()
			
		}) ;
	}
}

nodeim.login = function(u,p){
	
	nodeim.connect();
	var data = {
			username : u,
			password : p
	}

	nodeim.socket.command('signin',data,function(rspn){
		if (rspn.code == '200') {
			//alert("登陆成功，ID:" + rspn.doc.id + " \n" + rspn.message);
			
			console.log(rspn)
			
			nodeim.localUser = rspn.doc;

			jQuery("#title_Username").text(rspn.doc.username);
			kate.window.show() ;
			kate.parentWindow.hide() ;
			
			//face
			if( nodeim.localUser.facePath){
				jQuery("#facePic").attr("src" , nodeim.localUser.facePath);
			}
			
			
			//group
			if( nodeim.localUser.groups ){

				for(var i=0;i<nodeim.localUser.groups.length;i++){
					nodeim.createGroup(nodeim.localUser.groups[i].name)
				}
			}			

			nodeim.startDroppable();		    
			nodeim.friends();
			
		} else {
			alert(rspn.message);
		};
	});
}

nodeim.getUser = function(){
	return nodeim.localUser;
}
nodeim.setUser = function(data){
	nodeim.localUser = data;
	nodeim.profile()
}

nodeim.getServer = function(){
	return nodeim.server;
}

nodeim.message = function(data){
	
	nodeim.connect();
	
	nodeim.socket.command("message",data,function(rspn){
		if(rspn.code=='200')
		{
			
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.signup = function(data){
	
	nodeim.connect();
	
	nodeim.socket.command("signup",data,function(rspn){
		if(rspn.code=='200')
		{
			alert("<p style='color:red'>注册成功</p>");
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.searchUser = function(data){

	nodeim.connect();
	
	nodeim.socket.command("find",data,function(rspn){
		if(rspn.code=='200')
		{
			find2Window.show();
			find2Window.call("init_searchUser",[rspn.users]);
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}

/**
 * 
 */
nodeim.addFirend = function(id){

	nodeim.connect();
	
	nodeim.socket.command("subscribe",{to:id ,message:""},function(rspn){
		if(rspn.code=='200')
		{
			alert("好友添加完成，等待对方验证。");
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}

nodeim.replyFriend = function(data,callback){

	nodeim.connect();
	
	nodeim.socket.command("reply",data,function(rspn){
		if(rspn.code=='200')
		{
			callback()
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.profile = function(data,action){
	
	nodeim.connect();
	
	if( action == "createGroup"){

		if( nodeim.localUser.groups == undefined){
			nodeim.localUser.groups = [];
		}
		
		nodeim.localUser.groups.push({name:data.name});
		
	}
	
	nodeim.socket.command("profile",{doc:nodeim.localUser},function(rspn){
		
		if(rspn.code=='200')
		{
			if( action == "createGroup"){

				createGroupWindow.hide()
				nodeim.createGroup(data.name);
				nodeim.startDroppable();
				
			}
			
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.createGroup = function( name){
	
	var html = "";
	
	
	html += '<div class="wMainUserHeaderEx" groupName="'+name+'" onclick="toggleFriend(this)">'+name+' ( <span class="groupNum">0</span> )</div>';
	html += '<div class="wMainUserContainer" style="min-height: 26px" >';
	html += '	<div class="wMainUserItemText noFriend" style="padding-left: 25px; width: 100%; color: #aca899">此组中没有联系人</div>';
	html += '</div>';
	
	
	jQuery("#groupList").append(html);
	
}
nodeim.deleteGroup = function( name){
	
	for(var i=0;i<nodeim.localUser.groups.length;i++){
		if( nodeim.localUser.groups[i].name == name){
			nodeim.localUser.groups.splice(i,1);
		}
	}	
	
	
	nodeim.socket.command("profile",{doc:nodeim.localUser},function(rspn){
		if(rspn.code=='200')
		{
			jQuery(".wMainUserHeaderEx").each(function(){
				
				if( jQuery(this).attr("groupName") == name){
					
					jQuery(this).next().remove()
					jQuery(this).remove()
					
				}
			})
		    
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
	
}

/**
 * 好友列表
 */
nodeim.friends = function(){
	
	nodeim.connect();
	
	nodeim.socket.command("friends",{},function(rspn){
		if(rspn.code=='200')
		{
			jQuery(rspn.list).each(function(i){
				
				nodeim.createUser(rspn.list[i]);
	    	})
	    	
	    	nodeim.startDraggable();
			

			nodeim.sumFriend();
			nodeim.reOrder();
		    
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.createUser = function(data){
	var out = "";
	
	if( data.presence == "在线"){
		var isOn = "none";
	}else{
		var isOn = "";
	}
	
	var facePath = "images/im/m33.png";
	if( data.facePath){
		facePath = data.facePath;
	}
	
	out += '<div class="wMainUserItem" uid="'+data.id+'"' ;
	out += 'ondblclick="openChatWindow('+data.id+',\''+data.username+'\')" onclick="setBjcolor(this)"';
	out += 'style="width:100%">';
	out += '<div class="wMainListButton"';
	out += '	onmouseover="this.className=\'wMainListButton wMainListButtonHover\'"';
	out += '	onmouseout="this.className=\'wMainListButton\'">';
	out += '	<div class="zz" style="position:absolute;left:16px;display:'+isOn+'"><img src="images/im/zz.png"  style="height: 19px; width: 19px" ></div>';
	out += '	<img src="'+facePath+'"  uid="'+data.id+'"';
	out += '		style="height: 19px; width: 19px" >';
	out += '</div>';
	out += '<div class="wMainUserItemText" uid="'+data.id+'">';
	out += '	'+data.username+'&nbsp;&nbsp;<span style="color: #777"></span>';
	out += '</div>';
	out += '</div>';
	
	if( typeof(data.group) == "undefined"){
		
		jQuery("#defaultGroupList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == data.id){
				return ;
			}
		})
		
		jQuery("#defaultGroupList").append(out);
	}
	else{
		
		var isInsert = false;
		jQuery(".wMainUserHeaderEx").each(function(){
			
			if( jQuery(this).attr("groupName") == data.group){
				
				jQuery(this).next().append(out);
				isInsert = true;
			}
		})
		if( isInsert == false){
			jQuery("#defaultGroupList").append(out);
		}
		
	}

	
}
nodeim.log = function( id, page, room){
	nodeim.connect();

	nodeim.socket.command("log",{from :id ,room :room, page:page},function(rspn){
		if(rspn.code=='200')
		{
			for(var i=0;i<nodeim.chatWindowArr.length;i++){
				if( nodeim.chatWindowArr[i].id == id){
					
					
					nodeim.chatWindowArr[i].window.call("openLogCallBack",[rspn]);
				}
			}
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}

nodeim.status = function( sStatus, func){
	nodeim.connect();
	
	nodeim.socket.command("presence",{presence:sStatus},function(rspn){
		if(rspn.code=='200')
		{
			func();
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.group = function( uid ,groupname){

	nodeim.socket.command("group",{to:uid,group:groupname},function(rspn){
		if(rspn.code=='200')
		{

			jQuery(".wMainUserItem").each(function(i){
				
				if( jQuery(this).attr("uid") == uid){
					
					

					var tagDiv = jQuery("[groupName='"+groupname+"']").next();
					var tagDivNum = jQuery(tagDiv).prev().find("span[class=\"groupNum\"]")
					
					
					// 移动
					tagDivNum.html( Number(tagDivNum.text())+1);
					jQuery(this).css("top","0px");
					jQuery(this).css("left","0px");
					jQuery(this).prependTo( tagDiv);
					
					
					 // 重新计算好友数量
					nodeim.sumFriend();
					nodeim.reOrder();
					
					
					
					//jQuery("#onlineListNum").text(Number(jQuery("#onlineListNum").text()) +1);
					//jQuery("#unlineListNum").text(Number(jQuery("#unlineListNum").text()) -1);
					
				}
			})
		    
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
	
	
}

nodeim.removeUser = function(id){

	
	nodeim.connect();
	nodeim.socket.command("unsubscribe",{to:id},function(rspn){
		if(rspn.code=='200')
		{

			jQuery(".wMainUserItem").each(function(i){
				
				if( jQuery(this).attr("uid") == id){
					
					jQuery(this).remove()
				}
			})			
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
	
}

nodeim.getLocalTime = function(nS) {     
	var d =  new Date(parseInt(nS)); 
	return  d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
} 

nodeim.startDroppable = function(){
	
	$( ".wMainUserHeaderEx" ).droppable({
        greedy: true,
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function( event, ui ) {
        	
        	var groupName = jQuery(event.target).attr("groupName");
        	var uid = jQuery(event.toElement).attr("uid");
        	
        	
        	nodeim.group( uid, groupName);
        }
    });
}
nodeim.startDraggable = function(){
	
	$( ".wMainUserItem" ).draggable({ revert: "invalid" });
}

nodeim.sumFriend = function(){
	
	
	jQuery(".wMainUserHeaderEx").each(function(){
		
		var num = 0;
		jQuery(this).next().find(".wMainUserItem").each(function(){

			num++;
		})
		
		if(num == 0){
			var out = "";
			out += '<div class="wMainUserItemText noFriend"';
			out += 	'style="padding-left: 25px; width: 100%; color: #aca899">此组中没有联系人</div>';
			jQuery(this).next().html(out);
		}else{
			jQuery(this).next().find(".noFriend").remove()
		}
		jQuery(this).find("span[class=\"groupNum\"]").html( num);
		
	})
	
}

nodeim.reOrder = function(){

	jQuery(".wMainUserItem").each(function(i){
		
		if( jQuery(this).find("div[class='zz']").css("display") == "none"){
			
			jQuery(this).prependTo( jQuery(this).parent());
		}
	})
}
