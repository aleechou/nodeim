

module.exports = function(data,server,client,rspn)
{
	if(!data.username || !data.password)
	{
		rspn({code:404,msg:"缺少参数 username 或 password"}) ;
		return ;
	}

	server.db.colle("users").insert(data,function(err,docs){

		if( err )
		{
			rspn({code:404,msg:err.toString()}) ;
			return ;
		}

		console.log('insert',arguments) ;

		server.db.autoIncreaseId('users',{_id:docs[0]._id},'id',function(err,id){
			if( err )
			{
				rspn({code:404,msg:err.toString()}) ;
				return ;
			}

			console.log(arguments) ;
			rspn({code:200,id:id}) ;
		}) ;

	}) ;
}
