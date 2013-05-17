

module.exports = function(data,server,client,rspn)
{
	if(data.to===undefined || data.message===undefined)
	{
		rspn({code:404,message:"缺少参数 to 或 message"}) ;
		return ;
	}

	var data = server.message(client.session.user,data.to,data.message,undefined,function(rspndata){
		rspn( rspndata ) ;
	}) ;
}
