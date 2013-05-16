var io = require('socket.io').listen(80)
, fs = require('fs')
, Steps = require('ocsteps')
, mongodb = require('mongodb')
, DBHelper = require('./DBHelper')

var commands = [
	'signup' ,
	'signin' ,
] ;
var usercommands = [
	'signout' ,
	'message' ,
	'find' ,
	'presence' ,
] ;

var server = {
	db: null 
	, onlines: {}

	, message: undefined 
} ;


Steps(

	// 连接数据库
	function(){
		var server = new mongodb.Server('127.0.0.1',27017) ;
		(new mongodb.Db("im",server,{w:1})).open(this.hold()) ;
	}
	, function(err,client){
		if( err || !client )
		{
			throw new Error("无法链接到数据库："+err) ;
		}
		console.log("已经连接到数据库") ;
		server.db = new DBHelper(client) ;

		// 建立索引
		client.ensureIndex('users',{username:-1},  {background: true,unique:true}, function(){}) ;
		client.ensureIndex('users',{id:-1},  {background: true,unique:true}, function(){}) ;
	}



	// 启动 im 服务器
	, function(){

		io.sockets.on('connection', function (socket) {

			socket.session = {} ;

			socket.on('disconnect', function () {
				if( socket.session.user )
				{
					delete server.onlines[socket.session.user.id] ;
				}
				console.log('disconnect',arguments) ;
			});

			for(var i=0;i<commands.length;i++)
			{
				(function(name){
					var func = require(__dirname+"/commands/"+name+".js") ;
					socket.on(name, function (pkg) {
						func(pkg.data,server,socket,function(rspndata){
							socket.emit('rspn',{
								id: pkg.id
								, cmd: name
								, data: rspndata
							}) ;
						}) ;
					}) ;
				}) (commands[i]) ;
			}

			for(var i=0;i<usercommands.length;i++)
			{
				(function(name){
					var func = require(__dirname+"/commands/"+name+".js") ;
					socket.on(name, function (pkg) {

						var rspn = function(rspndata){
							socket.emit('rspn',{
								id: pkg.id
								, cmd: name
								, data: rspndata
							}) ;
						}

						if( !socket.session.user )
						{
							rspn({code:403,message:"尚未登陆"}) ;
							return ;
						}

						func(pkg.data,server,socket,rspn) ;
					}) ;
				}) (usercommands[i]) ;
			}

		});
	}

	// done
	, function(){
		console.log("服务器已经启动") ;
	}

) () ;




server.message = function(fromDoc,to,message,system)
{
	if( !this.onlines[to] )
	{
		return {code:404,message:'用户不在线'}
	}

	this.onlines[to].emit('message',{
		from: fromDoc
		, message: message
	}) ;

	return {code:200} ;
}



