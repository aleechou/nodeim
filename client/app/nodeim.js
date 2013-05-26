// JavaScript Document

var nodeim = {};
nodeim.socket = null;
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
					if(window.confirm("<p>"+data.from.username+"(id:"+data.from.id+") 请求加你为好友："+data.message+"</p>")){
		                 //alert("确定");
						nodeim.replyFriend({to:data.from.id  ,refuse:1});
		                return true;
		              }else{
		                 //alert("取消");
						nodeim.replyFriend({to:data.from.id  ,refuse:0});
		                return false;
		             } 
					break ;
				case 'refuse' :
					alert("<p>"+data.from.username+"(id:"+data.from.id+") 拒绝了你的好友请求："+data.message+"</p>") ;
					break ;
				case 'agree' :
					alert("<p>"+data.from.username+"(id:"+data.from.id+") 同意了你的好友请求："+data.message+"</p>") ;
					break ;

				default :
					
					chatWindow.call("onMessage",[data]);
					break ;
			}
		});
		nodeim.socket.on('connect',function(){
			$("#messageoutput").append("<p style='color:red'>已经连接到服务器</p>") ;
		}) ;
		nodeim.socket.on('presence',function(doc){
			alert("状态改变")
		}) ;
		nodeim.socket.on('room.join',function(doc){
			console.log('room.join:',doc) ;
		}) ;
		nodeim.socket.on('room.leave',function(doc){
			console.log('room.leave:',doc) ;
		}) ;
	}
}

nodeim.login = function(u,p){
	
	nodeim.connect();
	var data = {
			username : u,
			password : p
	}

	function loginCallBack(rspn) {
		
		if (rspn.code == '200') {
			//alert("登陆成功，ID:" + rspn.doc.id + " \n" + rspn.message);
			kate.window.show() ;
			kate.parentWindow.hide() ;
			
			nodeim.friends();
			
		} else {
			alert(rspn.message);
		};
	}
	nodeim.socket.command('signin',data,loginCallBack);
}

nodeim.message = function(data){
	
	nodeim.connect();
	
	nodeim.socket.command("message",data,function(rspn){
		if(rspn.code=='200')
		{
			alert("<p style='color:red'>消息已经发送</p>");
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

nodeim.replyFriend = function(data){

	nodeim.connect();
	
	nodeim.socket.command("reply",data,function(rspn){
		if(rspn.code=='200')
		{
			alert("test");
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
			if( rspn.list.length == 0){
				var out = "";
				out += '<div class="wMainUserItemText"';
				out += 	'style="padding-left: 25px; width: 100%; color: #aca899">此组中没有联系人</div>'
	    		jQuery("#unlineList").append(out)
	    		jQuery("#onlineList").append(out)
			}else{
				var out = "";
				jQuery(rspn.list).each(function(i){
					out += '<div class="wMainUserItem" u'
					out += 'onmousedown=""'
					out += 'onmouseup=""'
					out += 'oncontextmenu="function(){return !!0}"'
					out += 'ondblclick="openChatWindow()"'
					out += 'style="background-color: rgb(255, 239, 176);width:4000px">'
					out += '<div class="wMainListButton"'
					out += '	onmouseover="this.className=\'wMainListButton wMainListButtonHover\'"'
					out += '	onmouseout="this.className=\'wMainListButton\'">'
					out += '	<img src="images/im/m3.png" title="查看此人的联系人卡片"'
					out += '		style="height: 19px; width: 19px"'
					out += '		onclick="">'
					out += '</div>'
					out += '<div class="wMainUserItemText">'
					out += '	aarongao&nbsp;&nbsp;<span style="color: #777"></span>'
					out += '</div>'
					out += '</div>'
		    	})
	    		jQuery("#unlineList").append(out)
	    		jQuery("#onlineList").append(out)
			}
			
		}
		else
		{
			alert("<p style='color:red'>服务器返回："+rspn.message+"</p>");
		}
	}) ;
}


nodeim.getLocalTime = function(nS) {     
	return new Date(parseInt(nS)).toLocaleString().substr(13,20)
} 

