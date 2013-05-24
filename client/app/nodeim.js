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
					$("#messageoutput").append("<p>"+data.from.username+"(id:"+data.from.id+") 请求加你为好友："+data.message+"</p>") ;
					break ;
				case 'refuse' :
					$("#messageoutput").append("<p>"+data.from.username+"(id:"+data.from.id+") 拒绝了你的好友请求："+data.message+"</p>") ;
					break ;
				case 'agree' :
					$("#messageoutput").append("<p>"+data.from.username+"(id:"+data.from.id+") 同意了你的好友请求："+data.message+"</p>") ;
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
			console.log('presence：',doc) ;
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
			alert("登陆成功，ID:" + rspn.doc.id + " \n" + rspn.message);
			kate.window.show() ;
			kate.parentWindow.hide() ;
			
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







nodeim.getLocalTime = function(nS) {     
	return new Date(parseInt(nS)).toLocaleString().substr(13,20)
} 

