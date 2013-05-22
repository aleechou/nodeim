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
					var out = '<div class="wChatMsgTitle">'+data.from.username+'(id:'+data.from.id+') 说 ('+nodeim.getLocalTime(data.time)+')：</div>' ;
					if(data.room!==undefined)
					{
						out+= "[聊天室id:"+data.room+"]" ;
					}
					out+= '<div class="wChatMsgContent">'+data.message+'</div>' ;

					var div = $("#ii")[0].contentWindow.document.getElementById("messageoutput") ;
					jQuery(div).append(out);
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

nodeim.getLocalTime = function(nS) {     
	return new Date(parseInt(nS)).toLocaleString().substr(13,20)
} 
