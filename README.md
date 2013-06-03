
# 安装

```
git clone https://github.com/aleechou/nodeim.git
```

安装服务器端依赖项
```
cd nodeim/server
npm i ; cd -
```

启动
```
cd nodeim/server
node .
```


# 客户端 API

## 初始化

```html
<script src="socket.io.js"></script>
<script>
var socket = io.connect('http://localhost') ;

// 接受消息事件
socket.on('message', function (data) {
	console.log("收到消息：",data);
});
</script>
```

## 发送命令

向服务器发送命令：

```javascript
socket.command(name,data[,callback]) ;
```
* name: 命名名称
* data: 发送数据（json）
* callback: 回调函数（可选）
	服务器返回后，调用 callback 并将服务器返回的 json 作为参数传给给 callback


例如，发送消息给好友

```html
<script>
socket.command(
	
	// 命名名称
	'message'

	// 发送参数	
	, {
		// 好友 id
		to: 1234
		// 消息内容，支持 html
		, message: 'hello'
	}

	// 服务器返回后的回调函数，可以省略
	, function(data){				
		if(data.code=='200')
		{
			console.log("消息已经送出") ;
		}
		else
		{
			console.log("消息没有送出：",data) ;
		}
	}
)
</script>
```

---

## 注册用户：signup

data 中的必须参数：

* username
* password

以及其他任何属性都会被服务器保存

返回格式:
```javascript
{
	code: 200
	, message: 'oooxxx'
	, id: 1234				// 用户 id	
}
```

错误 code ：

* 405 用户名已经存在
* 500 服务器内部错误


## 注册用户：signin

data 中的必须参数：

* username 或 id
* password

返回格式:
```javascript
{
	code: 200
	, message: 'oooxxx'
	, doc: {				// 用户资料
		id: 1234			// 用户 id
		, username: 'oooxxx'
		, ... ...			// 其他由 signup 注册时保存的属性
	}
}
```

错误 code :

* 402 已经处于登陆状态
* 403 缺少用户名/id 或 密码
* 404 用户名不存在或密码错误



## 退出：signout

不需要参数

返回json中，code属性 200 表示成功




## 查找用户：find

data 中的可选参数：
* username
* id
* ... ... (其他任务注册用户时保存的字段)

返回json 为一个数组

## 发送消息：message

data 中的必须参数：

* to  用户 id
* message 消息内容，支持 html

返回json中，code属性 200 表示成功



## 加好友请求：subscribe

data 中的参数

* to 指定的用户id (必须)
* message 留言 (可选)

返回 code ：

* 200 请求完成
* 403 缺少参数 to
* 404 参数 to 指定的用户无效
* 306 重复请求

该命令会触发对方好友的 message 事件，type = 'request-subscription'


## 同意/拒绝加好友：reply

data 中的参数

* to 指定的用户id (必须)
* message 留言 (可选)
* refuse 1,0 (可选) 


该命令会触发对方好友的 message 事件，type = 'agree'/'refuse' 

## 删除好友

data 中的参数

* id  指定好友 (可选)




## 查询好友信息：friends

data 中的参数

* id  指定好友 (可选)

如果省略参数 id ，则返回所有好友信息和在线状态。可以在登陆后，调用这个API取的所有好友列表


## 给好友分组：group

data 中的参数

* to 指定的好友id (必须)
* group 分组名称 (必须)


--

## 创建聊天室：room.create

data参数：

* name (必须)
* intro (可选)

返回：

room 聊天室信息


```javascript
socket.command(
	'room.create'
	, {name:'疯子群',intro:'说疯话的地方'}
	, function(data){
		if( data.room!==undefined )
		{
			alert("创建聊天室成功，room id："+data.room.id) ;
		}
	}
) ;
```

## 加入聊天室：room.join

data参数：

* id  聊天室id

`room.join` 会触发同名的 `room.join` 事件，该事件通知所有聊天室内的成员，新成员加入。新成员也会收到该事件。

## 离开聊天室：room.leave

data参数：

* id  聊天室id

触发和命令同名的 `room.leave` 事件，通知所有聊天室内的成员，有成员离开


## 聊天室成员列表：room.list

data参数

* id  聊天室id

## 向聊天室发送消息：room.message

data参数

* id  聊天室id
* message 消息内容
* time (可选)



## 聊天记录：log


data参数:

* from 指定好友(可选)，缺省返回所有好友的聊天记录
* room 指定聊天室(可选)
* page 页数(可选)，缺省1


返回：

* currentPage 当前页数
* lastPage 最后一页
* docs (Array) 聊天记录


## 用户状态：presence

data 中的参数

* presence		状态(string)


---

# 客户端事件

## message

data 中的参数

* to	接受消息的用户id
* from	发送消息的用户的详细资料
	* id
	* username
	* ... ... 其他注册的字段
* message 消息文本
* type 
* time
* room 聊天室id，如果为undefined 表示一对一聊天


type :
	* undefined 				普通用户消息
	* 'system' 					系统通知
	* 'request-subscription'	请求添加好友
	* 'refuse'					加好友请求被拒绝
	* 'agree'					加好友请求被接受



## presence

当好友上线、离线、隐身等状态发生变化时，触发此事件

data 中的参数

* id			好有id
* presence		状态



## upload

文件上传面板 `http://<server addr>:<port>/nodeim-server/upload?user=<user id>` ，上传完成后会在对应客户端触发 `upload` 事件，事件传回文件在服务器上的 http url 。

可用于发送文件,图片,以及设置用户头像

data 中的参数：

* url		文件在服务器上的访问地址，不包括主机名部分
* filename	文件名






