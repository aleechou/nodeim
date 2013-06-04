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
					
					nodeim.createUser("online" , data.from);
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
			
			if( doc.presence == "在线"){
				
			}
			if( doc.presence == "离线"){
				
			}
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
			alert("文件上传成功："+doc.filename+", url:"+doc.url) ;
			console.log("文件上传成功："+doc.filename+", url:"+doc.url) ;
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
			
			nodeim.friends();
			
		} else {
			alert(rspn.message);
		};
	});
}

nodeim.getUser = function(){
	return nodeim.localUser;
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
	    	
	    	

		    $( ".wMainUserItem" ).draggable({ revert: "invalid" });
		    $( "#defaultGroup" ).droppable({
		        greedy: true,
		        activeClass: "ui-state-hover",
		        hoverClass: "ui-state-active",
		        drop: function( event, ui ) {
		        	alert("sddddddds")
		        }
	        });
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.createUser = function(data){
	var out = "";
	
	out += '<div class="wMainUserItem" uid="'+data.id+'"' ;
	out += 'ondblclick="openChatWindow('+data.id+',\''+data.username+'\')" onclick="setBjcolor(this)"';
	out += 'style="width:100%">';
	out += '<div class="wMainListButton"';
	out += '	onmouseover="this.className=\'wMainListButton wMainListButtonHover\'"';
	out += '	onmouseout="this.className=\'wMainListButton\'">';
	out += '	<img src="images/im/m3.png" title="查看此人的联系人卡片"';
	out += '		style="height: 19px; width: 19px"';
	out += '		onclick="">';
	out += '</div>';
	out += '<div class="wMainUserItemText">';
	out += '	'+data.username+'&nbsp;&nbsp;<span style="color: #777"></span>';
	out += '</div>';
	out += '</div>';
	
	if( typeof(data.group) == "undefined"){
		
		if( jQuery("#defaultGroupNum").text() == "0"){
			jQuery("#defaultGroupList").empty();
		}
		
		jQuery("#defaultGroupList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == data.id){
				return ;
			}
		})
		
		jQuery("#defaultGroupNum").text(Number(jQuery("#defaultGroupNum").text()) +1);
		jQuery("#defaultGroupList").append(out);
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


nodeim.group = function( type, id){

	if( type == "online"){
		jQuery("#unlineList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == id){
				

				if( Number(jQuery("#onlineListNum").text() == 0)){
					jQuery("#onlineList").html("");
				}
				
				jQuery(this).prependTo("#onlineList");
				jQuery("#onlineListNum").text(Number(jQuery("#onlineListNum").text()) +1);
				jQuery("#unlineListNum").text(Number(jQuery("#unlineListNum").text()) -1);
				
				jQuery("#onlineList").css("height" , Number(jQuery("#onlineListNum").text()) * 26);
				//jQuery(this).remove();
			}
		})
	}else{
		jQuery("#unlineList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == id){

				if( Number(jQuery("#unlineListNum").text() == 0)){
					jQuery("#unlineList").html("");
				}
				jQuery(this).prependTo("#unlineList");
				jQuery("#unlineListNum").text(Number(jQuery("#unlineListNum").text()) +1);
				jQuery("#onlineListNum").text(Number(jQuery("#onlineListNum").text()) -1);
				
				jQuery("#unlineList").css("height" , Number(jQuery("#unlineListNum").text()) * 26);
			}
		})
	}
}

nodeim.removeUser = function(type,data){

	if( type == "online"){
		jQuery("#onlineList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == data.id){
				jQuery(this).remove();
			}
		})
	}else{
		jQuery("#unlineList > .wMainUserItem").each(function(i){
			if( jQuery(this).attr("uid") == data.id){
				jQuery(this).remove();
			}
		})
	}
}
nodeim.noUser = function(type){

	var out = "";
	out += '<div class="wMainUserItemText"';
	out += 	'style="padding-left: 25px; width: 100%; color: #aca899">此组中没有联系人</div>';
	
	
}

nodeim.getLocalTime = function(nS) {     
	var d =  new Date(parseInt(nS)); 
	return  d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
} 

