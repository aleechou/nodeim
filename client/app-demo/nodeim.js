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
			
			jQuery(".wMainUserItem").each(function(i){
				
				if( jQuery(this).attr("uid") == doc.id){
					
					if( doc.presence == "在线"){
						jQuery(this).find("img").attr("class","");
					}else{
						jQuery(this).find("img").attr("class","c2");
					}
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
			alert("文件上传成功："+doc.filename+", url:"+doc.url) ;
			console.log("文件上传成功："+doc.filename+", url:"+doc.url) ;
		}) ;
	}
}

nodeim.login = function(u,p,func){
	
	nodeim.connect();
	var data = {
			username : u,
			password : p
	}

	nodeim.socket.command('signin',data,function(rspn){
		if (rspn.code == '200') {
			
			
			func()
			
		} else {
			alert(rspn.message);
		};
	});
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
	    	
	    	start();
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
		var sCls = "";
	}else{
		var sCls = "c2";
	}
	
	
	out += '<div class="wMainUserItem" uid="'+data.id+'"' ;
	out += 'ondblclick="openChatWindow('+data.id+',\''+data.username+'\')" ';
	out += 'style="width:100%">';
	out += '<div class="wMainListButton"';
	out += '	onmouseover="this.className=\'wMainListButton wMainListButtonHover\'"';
	out += '	onmouseout="this.className=\'wMainListButton\'">';
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

function start(){
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