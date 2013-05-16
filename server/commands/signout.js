
module.exports = function(data,server,client,rspn)
{
	delete server.onlines[client.session.user.id] ;
	delete client.session.user ;

	rspn({code:200,message:"bye"}) ;
}