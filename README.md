
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
		id: 1234
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
			console.log("消息没有送出",data) ;
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

## 退出：signout

不需要参数

返回json中，code属性 200 表示成功


## 发送消息：message

data 中的必须参数：

* id  用户 id
* message 消息内容，支持 html

返回json中，code属性 200 表示成功


