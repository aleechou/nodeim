

module.exports = function(data,server,client,rspn)
{
	if(!data.password)
	{
		rspn({code:403,message:"缺少密码"}) ;
		return ;
	}

	server.db.colle('users').findOne(data,function(err,doc){

		if(err)
		{
			rspn({code:500,message:err.toString()}) ;
			return ;
		}

		delete doc.password ;
		delete doc._id ;

		client.session.user = doc ;
		server.onlines[doc.id] = client ;

		rspn({code:200,message:"welcome back, "+doc.username,doc:doc}) ;
	}) ;
}
