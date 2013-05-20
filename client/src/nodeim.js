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
					$("#messageoutput").append("<p>"+data.from.username+"(id:"+data.from.id+") 发来消息："+data.message+"</p>") ;
					break ;
			}
		});
		nodeim.socket.on('connect',function(){
			console.log('连接服务器成功') ;
		}) ;
		nodeim.socket.on('presence',function(doc){
			console.log('presence：',doc) ;
		}) ;
	}
}

/**
 * login
 */
nodeim.login = function( name, passwd){
	
	nodeim.connect();
	
	var data = {
		username: name
		, password: passwd
	}
	nodeim.socket.command('signin',data,function(rspn){
		if(rspn.code=='200')
		{
			alert("登陆成功，ID:"+rspn.doc.id+" \n"+rspn.message) ;
		}
		else
		{
			alert(rspn.message) ;
		}
	}) ;
	
}