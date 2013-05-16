

module.exports = function(data,server,client,rspn)
{
	if(data.id===undefined || data.message===undefined)
	{
		rspn({code:404,message:"缺少参数 id 或 message"}) ;
		return ;
	}

	var data = server.message(client.session.user,data.id,data.message) ;
	console.log(data) ;
	rspn( data ) ;
}
