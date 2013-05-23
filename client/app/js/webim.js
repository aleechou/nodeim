var _webIM = null;
var localip = "";
if(location.hostname=='')
{
	localip = "http://webos.knowledge.com.cn/webim/";
}else{
	localip = "http://"+location.hostname+"/webim/";
}
var myflash;
var Visitorflash;

Customid =10000;

function IntWebIM()
{
	if(!wm("windowContainerBorder"))
	{
		new WebIM().Initialize();
	}
}

//临时聊天，被放弃
function TempChat()
{
	new Ajax().get(localip+"data/gettempemail.php",function(o){
		var em = o.responseText.trim();
		if(2>em.length){
			alert("很抱歉，当前没有空闲的匿名帐号！");
		}
		else{
			Other.SetCookie("stremail",em);
			Other.SetCookie("strpass","123456");
			Other.SetCookie("saveemail","1");
			Other.SetCookie("savepass","1");
			Other.SetCookie("autologin","1");
			IntWebIM();
		}
	});
}
function WebIM()
{
	var _me = (_webIM=this);
	this.Sys = null;
	this.Profile = null;  //个人档案
	this.Config  = null;  //个人配置
	this.Friend  = null;  //好友列表
	this.Custom  = null;  //陌生人列表
	this.Group   = null;  //分组信息
	this.Win     = null;  //窗体对象
	this.Version = "1.0";   //版本号
	//辅助
	this.Common = {
		//播放声音
		playSound:function(soundname)
		{
			var oDiv = wm("divSound");
			if(!oDiv)return;
			Elem.Value(oDiv,"<embed id=\"sound\" name=\"sound\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" src=\""+localip+"sound/"+soundname+".swf\" width=\"1\" height=\"1\" type=\"application/x-shockwave-flash\" autoplay=\"true\" quality=\"high\" loop=\"False\"></embed>");
		},
		//将字符表情替换成图片
		replaceFaceFromStr:function(str)
		{
			var faces = [];
			faces = _me.Data.getMsnFaceInfo();
			for(var i=0;i<faces.length;i++)
			{
				var face = faces[i];
				str = str.replaceAll(face[2],"<img style='height:19px;width:19px' src='"+localip+"msnface/"+face[0]+".gif'/>");
				if(face.length>3)str = str.replaceAll(face[3],"<img style='height:19px;width:19px' src='"+localip+"msnface/"+face[0]+".gif'/>");
			}
			return str;
		},
		//根据UserStatus返回对应字符串
		getUserStatusStr:function(n)
		{
			return ["联机","忙碌","马上回来","离开","通话中","外出就餐","隐身"][n];
		},
		//根据OnlineStatus返回对应字符串
		getOnlineStatusStr:function(n)
		{
			return ["在线","忙碌","离开","脱机"][n];
		},
		customChat:function()
		{
			if(Customid!=10000)_webIM.CMD.openChatWindow(Customid,true);
		},
		//根据UserStatus返回在线状态OnlineStatus
		getOnlineStatus:function(n)
		{
			return [0,1,2,2,1,2,3,3][n];
		},
		//由GroupID得到Group对象
		getGroupById:function(id)
		{
			var g = null;
			for(var i=0;i<_me.Group.length;i++)
			{
				if(_me.Group[i].ID==id)
				{
					g = _me.Group[i];
					break;
				}
			}
			return g;
		},
		//由GroupName得到Group对象
		getGroupByName:function(gname)
		{
			var g = null;
			for(var i=0;i<_me.Group.length;i++)
			{
				if(_me.Group[i].Name==gname)
				{
					g = _me.Group[i];
					break;
				}
			}
			return g;
		},
		//从xml里拆出Custom对象
		getCostumFromXml:function(xml)		
		{
			var Custom = [];
			var items=wmT(xml,'item');
			if(!items||items.length<1)return null;
			for(var i=0;i<items.length;i++)
			{
				var item = items[i];
				var face      = Xml.First(item,"f");
				var id        = parseInt(Xml.First(item,"id"));
				var name      = Xml.First(item,"n");
				var email     = Xml.First(item,"e");
				var sign      = Xml.First(item,"sn");
				var status    = Xml.First(item,"s");
				var groupid   = Xml.First(item,"g");
				var isblocked = Xml.First(item,"b")=="1";
				var customname= Xml.First(item,"cn");
				var gender    = Xml.First(item,"u");
				if(!_me.Common.getCustomFromArr(id,Custom))//防止重复
					Custom.add(new _me.Model.Custom(face,id,name,email,sign,parseInt(status),parseInt(groupid),isblocked,customname,gender));
			}
			return Custom;
		},
		//从xml里拆出User对象
		getUserFromXml:function(xml)
		{
			var users = [];
			var items=wmT(xml,'item');
			if(!items||items.length<1)return null;
			for(var i=0;i<items.length;i++)
			{
				var item = items[i];
				var face      = Xml.First(item,"f");
				var id        = parseInt(Xml.First(item,"id"));
				var name      = Xml.First(item,"n");
				var email     = Xml.First(item,"e");
				var sign      = Xml.First(item,"sn");
				var status    = Xml.First(item,"s");
				var groupid   = Xml.First(item,"g");
				var isblocked = Xml.First(item,"b")=="1";
				var customname= Xml.First(item,"cn");
				var gender    = Xml.First(item,"u");
				if(!_me.Common.getUserFromArr(id,users))//防止重复
					users.add(new _me.Model.User(face,id,name,email,sign,parseInt(status),parseInt(groupid),isblocked,customname,gender));
			}
			return users;
		},
		//根据UserID从custom数组中返回User对象
		getCustomFromArr:function(id,users)
		{
			//if(Customid!==10000 && Customid!==''){
			//	return users;
			//}
			if(users == null){
				return null;
			}
			for(var i=0;i<users.length;i++)
			{
				if(users[i].UserID==id)return users[i];
			}
			return null;
		},
		//根据UserID从User数组中返回User对象
		getUserFromArr:function(id,users)
		{
			if(users==null){
				return null;
			}
			for(var i=0;i<users.length;i++)
			{
				if(users[i].UserID==id)return users[i];
			}
			return null;
		},
		//从xml里拆出Group对象
		getGroupFromXml:function(xml)
		{
			var groups = [];
			var items=wmT(xml,'item');
			for(var i=0;i<items.length;i++)
			{
				var item = items[i];
				var name      = Xml.First(item,"Name");
				var id        = Xml.First(item,"ID");
				groups.add(new _me.Model.Group(name,parseInt(id)));
			}
			if(groups.length<1)groups.add(new _me.Model.Group("默认",1));
			return groups;
		},
		//从xml里拆出Msg对象
		getMsgFromXml:function(xml)
		{
			var msgs = [];
			var items=wmT(xml,'item');
			for(var i=0;i<items.length;i++)
			{
				var item = items[i];
				var from      = Xml.First(item,"From");
				var to        = Xml.First(item,"To");
				var content      = Xml.First(item,"Content");
				var type        = Xml.First(item,"Type");
				var isconfirm      = Xml.First(item,"IsConfirm");
				var addtime        = Xml.First(item,"AddTime");
				msgs.add(new _me.Model.Msg(from,to,content,type,isconfirm,addtime));
			}
			return msgs;
		},
		//从xml里拆出Config对象
		getConfigFromXml:function(xml)
		{
			var items=wmT(xml,'item');
			
			if(!items||items.length<1)return null;
			var item = items[0];
			var distype      = Xml.First(item,"DisType");
			var ordertype        = Xml.First(item,"OrderType");
			var chatside      = Xml.First(item,"ChatSide");
			var msgsendkey     = Xml.First(item,"MsgSendKey");
			var msgshowtime     = Xml.First(item,"MsgShowTime");
			var userpower     = Xml.First(item,"UserPower");
			return new _me.Model.Config(parseInt(distype),parseInt(ordertype),parseInt(chatside),parseInt(msgsendkey),parseInt(msgshowtime),parseInt(userpower));
		},
		//搜索好友
		searchFriendList:function(k)
		{
			var result = [];
			for(var i=0;i<_me.Friend.length;i++)
			{
				var p = _me.Friend[i];
				if(p.UserName.indexOfEx(k)>-1||p.UserEmail.indexOfEx(k)>-1||p.CustomName.indexOfEx(k)>-1)//昵称、邮箱、自定义昵称
				{
					result.add(p);
				}
			}
			return result;
		},
		//对好友列表排序
		sortFriendList:function()
		{
			switch(_me.Config.OrderType)
			{
				case 1://状态
					_me.Friend.sort(
						function(a,b)
						{
							if(a.OnlineStatus==b.OnlineStatus)
							{
								return a.UserName.localeCompare(b.UserName);
							}
							else
							{
								return a.OnlineStatus<b.OnlineStatus?-1:1;
							}
						});
					return;
				case 2://分组
					_me.Friend.sort(
						function(a,b)
						{
							if(a.GroupID==b.GroupID)
							{
								if(a.OnlineStatus==b.OnlineStatus)
								{
									return a.UserName.localeCompare(b.UserName);
								}
								else
								{
									return a.OnlineStatus<b.OnlineStatus?-1:1;
								}
							}
							else
							{
								return a.GroupID<b.GroupID?-1:1;
							}
						});
					return;
			}
		},
		//改变选中item
		changeSelItem:function(o,evt)
		{
			var objSel = _me.Sys["ObjSel"];
			var e = evt||event;
			if(objSel&&objSel!=o)
			{
				objSel.style.backgroundColor = "";
			}
			if(Other.Browser()=="opera")
			{
				if(wm("btnOpera"))Elem.Del("btnOpera");
				var btn = Elem.New("input","btnOpera");
				btn.type = "button";
				var bs = btn.style;
				bs.zIndex = "9999";
				bs.opacity = "0.01";
				bs.height = "20px";
				bs.width = "20px";
				bs.top = (Evt.Top(e)-5)+"px";
				bs.left = (Evt.Left(e)-5)+"px";
				bs.position = "absolute";
				Elem.Add(btn);
			}
			o.style.backgroundColor = "#FFEFB0";
			_me.Sys["ObjSel"] = o;
		},
		//联系人右键菜单
		showContextMenu:function(o,evt)
		{
			Other.Browser()=="opera"&&Elem.Del("btnOpera");
			var e = evt||event;
			if(parseInt(e.button)==2)//右键菜单
			{
				var id = _me.Win.id;
				var t = _me.Win.type;
				var uid = o.getAttribute("uid");
				var gid = o.getAttribute("gid");
				if(uid)
				{
					var u = _me.Common.getUserFromArr(uid,_me.Friend);
					if(!u)return;
					var arr = [];
					arr.add(u.OnlineStatus<3?"<strong>发送即时消息</strong>|_webIM.CMD.openChatWindow("+uid+",true)":"<strong>发送脱机即时消息</strong>|_webIM.CMD.openChatWindow("+uid+",true)");
					arr.add("发送电子邮件|_webIM.Common.showLink(300,122,(Elem.Height()-122)/2,(Elem.Width()-300)/2,11,'发送电子邮件',"+localip+"'page/sendemail.php?e="+u.UserEmail+"')");
					arr.add("");
					arr.add("查看联系人卡片|_webIM.CMD.showCard("+uid+",wm('wMainUserItemId"+id+"Type"+t+"No"+uid+"'))");
					arr.add("查看消息历史记录|_webIM.CMD.showMsgHistory("+uid+")");
					arr.add(u.CustomName==u.UserName?"添加昵称|_webIM.CMD.editCustomName("+uid+")":"编辑昵称|_webIM.CMD.editCustomName("+uid+")");
					if(_me.Config.OrderType==2)arr.add("编辑分组|_webIM.CMD.eidtUserGroup("+uid+")");
					arr.add(u.IsBlocked?"取消阻止联系人|_webIM.CMD.blockFriend("+uid+",2)":"阻止联系人|_webIM.CMD.blockFriend("+uid+",1)");
					arr.add("删除联系人|_webIM.CMD.delFriend("+uid+")");
				}
				else if(gid)
				{
					var arr = [];
					arr.add("重命名组|_webIM.CMD.editGroup("+gid+")");
					arr.add("删除组|_webIM.CMD.delGroup("+gid+")");
					arr.add("");
					arr.add("创建新组|_webIM.CMD.addGroup()");
				}
				else
				{
					return;
				}
				var m = new SysMenu("menuUserNameId"+id+"Type"+t);
				m.Data = arr;
				m.Width = 130;
				m.E = e;
				m.Show();
			}
		},
		//插入一个item头,obj:对象,title:标题,no:编号
		addUserHeader:function(obj,title,no)
		{
			var id = _me.Win.id;
			var t = _me.Win.type;
			var header = Elem.New("div","wMainUserHeaderId"+id+"Type"+t+"No"+no,"wMainUserHeaderEx",title);
			header.onmouseover = function()
			{
				this.className = "wMainUserHeaderEx wMainUserHeaderExHover";
			};
			header.onmouseout = function()
			{
				this.className = "wMainUserHeaderEx";
			};
//			if(_me.Config.OrderType==2)header.setAttribute("gid",no);
header.setAttribute("gid",no);

			header.onmousedown = function(e){_me.Common.changeSelItem(this,e);};
			header.onmouseup = function(e){_me.Common.showContextMenu(this,e);};
			header.onclick = function()
			{
				if(this.className=="wMainUserHeader wMainUserHeaderHover")
				{
					this.className = "wMainUserHeaderEx wMainUserHeaderExHover";
					this.onmouseout = function(){this.className = "wMainUserHeaderEx";};
					this.onmouseover = function(){this.className = "wMainUserHeaderEx wMainUserHeaderExHover";};
					Elem.Show(this.nextSibling);
				}
				else
				{
					this.className = "wMainUserHeader wMainUserHeaderHover";
					this.onmouseout = function(){this.className = "wMainUserHeader";};
					this.onmouseover = function(){this.className = "wMainUserHeader wMainUserHeaderHover";};
					Elem.Hid(this.nextSibling);
				}
			};
			var container = Elem.New("div","wMainUserContainerId"+id+"Type"+t+"No"+no,"wMainUserContainer");
			Elem.Add(obj,header,container);
		},
		//插入一个item,n:1简要2详细,u:User对象
		createUserItem:function(n,u)
		{
			var id = _me.Win.id;
			var t = _me.Win.type;
			var ban = u.IsBlocked?"b":"";
			var str = new StringBuilder();
			switch(n)
			{
				case 1:
					str.add("<div id=\"wMainUserItemId"+id+"Type"+t+"No"+u.UserID+"\" class=\"wMainUserItem\" uid=\""+u.UserID+"\" onmousedown=\"_webIM.Common.changeSelItem(this,event)\" onmouseup=\"_webIM.Common.showContextMenu(this,event)\" oncontextmenu=\"function(){return !!0}\" ondblclick=\"var uid = this.getAttribute('uid');if(uid)_webIM.CMD.openChatWindow(uid,true);\">");
					str.add("<div class=\"wMainListButton\" onmouseover=\"this.className='wMainListButton wMainListButtonHover'\" onmouseout=\"this.className='wMainListButton'\">");
					str.add("<img src=\""+localip+"images/im/m"+u.OnlineStatus+ban+".png\" title=\"查看此人的联系人卡片\" style=\"height:19px;width:19px\" onclick=\"_webIM.CMD.showCard("+u.UserID+",this.parentNode)\"/>");
					str.add("</div>");
					str.add("<div class=\"wMainUserItemText\">"+u.CustomName+"&nbsp;&nbsp;<span style=\"color:#777\">"+u.UserSign+"</span></div>");
					str.add("</div>");
					break;
				case 2:
					str.add("<div id=\"wMainUserItemId"+id+"Type"+t+"No"+u.UserID+"\" class=\"wMainUserItemBig\" uid=\""+u.UserID+"\" onmousedown=\"_webIM.Common.changeSelItem(this,event)\" onmouseup=\"_webIM.Common.showContextMenu(this,event)\" oncontextmenu=\"function(){return !!0}\" ondblclick=\"var uid = this.getAttribute('uid');if(uid)_webIM.CMD.openChatWindow(uid,true);\">");
					str.add("<div class=\"wMainUserItemFaceBG\"><img style=\"width:51px;height:51px\" src=\""+localip+"userface/"+u.UserFace+"\" /></div>");
					str.add("<div class=\"wMainUserItemBigRight_c\">");
					str.add("<div class=\"wMainUserItemStatus_c\" ><img style=\"height:19px;width:19px\" src=\""+localip+"images/im/m"+u.OnlineStatus+ban+".png\"/></div>");
					str.add("<div style=\"padding-top:2px;color:#06f;\" class=\"usersign_c\">"+u.CustomName+"</div>");
					str.add("<div style=\"padding-top:2px;color:#666\" class=\"usersign_c\">"+u.UserSign+"</div>");
					str.add("<div style=\"padding-top:2px;color:#6cf\" class=\"usersign_c\">"+u.UserEmail+"</div>");
					str.add("</div>");
					str.add("</div>");
					break;
				case 3:
					str.add("<div class=\"wMainUserItemBig\" style=\"padding-left:0\">");
					str.add("<div class=\"wMainUserItemFaceBG\"><img style=\"width:51px;height:51px\" src=\""+localip+"userface/"+u.UserFace+"\" /></div>");
					str.add("<div class=\"wMainUserItemBigRight\">");
					str.add("<div class=\"wMainUserItemStatus\" ><img style=\"height:19px;width:19px\" src=\""+localip+"images/im/m"+u.OnlineStatus+ban+".png\"/></div>");
					str.add("<div style=\"padding-top:2px;color:#06f\">"+u.CustomName+"</div>");
					str.add("<div style=\"padding-top:2px;color:#666\">"+u.UserSign+"</div>");
					str.add("<div style=\"padding-top:2px;color:#6cf\">"+u.UserEmail+"</div>");
					str.add("</div>");
					str.add("</div>");
					break;
			}
			return str.toString();
		},
		//显示一个警告框
		showAlert:function(msg,title,closecb,url,icon,loadedcb)
		{
			if(wm("windowCover"))
			{
				var cs = wm("windowCover").style;
				cs.display = "block";
				cs.height = Elem.Height()+"px";
				cs.width = Elem.Width()+"px";
				cs.zIndex = ++window.zIndex;
			}
			var w = new WebForm();
			w.Title = title||"注意";
			w.Icon = icon||"im/warning.png";
			w.Type = 3;
			w.UserID = 4;
			w.Height = 120;
			w.Width = 210;
			w.CanControl = !!0;
			w.Resizeable = !!0;
			w.ShowCorner = !!0;
			w.ContentUrl = url||localip+"layout/winalert.htm";
			w.Left = (Elem.Width()-210)/2;
			w.Top = (Elem.Height()-130)/2;
			w.RepaintMethod = function(w,h,id,t){wm("wOtherMainId"+id+"Type"+t).style.height = h+"px";if(wm("divMsgId"+id+"Type"+t))Elem.Value("divMsgId"+id+"Type"+t,msg);};
			w.CloseCallback = closecb||null;
			w.LoadedCallback = function(id,t)
			{
				wm("btnSelId"+id+"Type"+t).focus();
				if(loadedcb)loadedcb(id,t);
			};
			w.Show();
			w.Focus();
			return w;
		},
		//customChat:function()
		//{

		//	if(Customid)_webIM.CMD.openChatWindow(Customid,true);
		//},
		
		
		//显示一个确认框,回传cb的第三个参数含义:点确定为true;取消为false
		showConfirm:function(msg,title,cb)
		{
			_me.Common.showAlert(msg,title,cb,localip+"layout/winconfirm.htm","im/confirm.png");
		},
		//显示一个文本输入框,回传cb的第三个参数含义:输入内容
		showPrompt:function(value,title,cb)
		{
			_me.Common.showAlert(value,title,cb,localip+"layout/winprompt.htm");
		},
		//显示一个下拉框
		showSelect:function(title,loadedcb,closecb)
		{
			_me.Common.showAlert(null,title,closecb,localip+"layout/winselect.htm",null,loadedcb);
		},
		//显示一个窗口，窗口里用iframe的形式显示所给网页
		showLink:function(_w,_h,_t,_l,_id,_title,_url,_icon,_closecb)
		{
			var wLink = WinManage.GetWindow(_id,3);//存在
			if(wLink)
			{
				if(wLink.isMin)wLink.win.Minimize();
				wLink.win.Focus();
				return;
			}
			var w = new WebForm();
			w.Title = _title||"WebIM";
			w.Icon = _icon||"im/icon.png";
			w.Type = 3;
			w.UserID = _id;
			w.Height = _h;
			w.Width = _w;
			w.Left = _l;
			w.Top = _t;
			w.Resizeable = !!0;
			w.ShowCorner = !!0;
			w.Content = "<iframe scrolling='no' id='ifrId[id]Type[type]' frameborder='0' src='"+_url+"'></iframe>";
			w.RepaintMethod = function(w,h,id,t){wm("ifrId"+id+"Type"+t).style.height = h+"px";wm("ifrId"+id+"Type"+t).width=w-2+"px";};
			if(_closecb)w.CloseCallback = _closecb;
			w.LoadedCallback = function(){w.ShowLoading();};
			w.Show();
			w.Focus();
		}
	};
	//模型
	this.Model = {
		//用户模型
		User:function(_face,_id,_name,_email,_sign,_userStatus,_groupId,_isBlocked,_customname,_gender)
		{
			this.UserFace = _face;
			this.UserID = _id;
			this.UserName =_name;
			this.UserEmail = _email;
			this.UserSign = _sign;
			this.OnlineStatus = _me.Common.getOnlineStatus(_userStatus);
			this.UserStatus = _userStatus;
			this.GroupID = _groupId;
			this.IsBlocked = _isBlocked;
			this.CustomName= _customname||_name;
			this.UserGender= _gender;
		},
		//陌生人模型
		Custom:function(_face,_id,_name,_email,_sign,_userStatus,_groupId,_isBlocked,_customname,_gender)
		{
			this.UserFace = _face;
			this.UserID = _id;
			this.UserName =_name;
			this.UserEmail = _email;
			this.UserSign = _sign;
			this.OnlineStatus = _me.Common.getOnlineStatus(_userStatus);
			this.UserStatus = _userStatus;
			this.GroupID = _groupId;
			this.IsBlocked = _isBlocked;
			this.CustomName= _customname||_name;
			this.UserGender= _gender;
		},
		//分组模型
		Group:function(_name,_id)
		{
			this.Name = _name;
			this.ID = _id;
		},
		//用户配置
		Config:function(_dis,_order,_side,_sendkey,_showtime,_userpower)
		{
			this.DisType    = _dis;//显示方式1默认2大图标
			this.OrderType  = _order;//排序方式1状态2分组
			this.ChatSide   = _side;//聊天窗口是否显示图片1是2不是
			this.MsgSendKey = _sendkey;//发送消息热键,1enter2ctrl+enter
			this.MsgShowTime = _showtime;//发送时间,1显示2不显示
			this.UserPower = _userpower; //用户权限
		},
		//消息
		Msg:function(_f,_t,_c,_type,_i,_time)
		{
			this.From = _f; //消息来源
			this.To   = _t; //消息去向
			this.Content = _c; //消息主体
			this.Type    = _type;//1文本2特殊3添加好友4删除好友5状态改变6广告
			this.IsConfirm = _i; //消息是否确认
			this.AddTime = _time;//消息发布时间
		},
		//系统
		Sys:function(_c)
		{
			this.Code = _c;//校验码
			this.IntervalTime = 3500; //循环间隔
			this.IntervalID = null;   //循环ID
		}
	};
	//数据
	this.Data = {
		//msn表情信息
		getMsnFaceInfo:function()
		{
			return [["regular_smile","笑脸",":-)",":)"],["teeth_smile","咧嘴笑脸",":-D",":d"],["omg_smile","惊讶的笑脸",":-O",":o"],["tongue_smile","吐舌笑脸",":-P",":p"],["wink_smile","眨眼笑脸",";-)",";)"],["sad_smile","悲伤的脸",":-(",":("],["confused_smile","困惑的笑脸",":-S",":s"],["what_smile","失望的脸",":-|",":|"],["cry_smile","哭泣的脸",":B"],["red_smile","尴尬的笑脸",":-$",":$"],["shades_smile","热烈的笑脸","(H)","(h)"],["angry_smile","生气的脸",":-@",":@"],["angel_smile","天使","(A)","(a)"],["devil_smile","恶魔","(6)"],["47_47","保守秘密",":-#"],["48_48","咬牙切齿","8o|"],["49_49","书呆子","8-|"],["50_50","讽刺的脸","^o)"],["51_51","悄悄话",":-*"],["52_52","生病的脸","+o("],["71_71","不知道",":^)"],["72_72","正在思考","*-)"],["74_74","聚会笑脸",":-M"],["75_75","转动眼睛","8-)"],["77_77","困了","|-)"],["coffee","咖啡","(C)","(c)"],["thumbs_up","太棒了","(Y)","(y)"],["thumbs_down","太差了","(N)","(n)"],["beer_mug","啤酒杯","(B)","(b)"],["martini","高脚杯","(D)","(d)"],["girl","女孩","(X)","(x)"],["guy","男孩","(Z)","(z)"],["guy_hug","左侧拥抱","({)"],["girl_hug","右侧拥抱","(})"],["bat","吸血蝙蝠",":-[",":["],["cake","生日蛋糕","(^)"],["heart","红心","(L)","(l)"],["broken_heart","破碎的心","(U)","(u)"],["kiss","红唇","(K)","(k)"],["present","礼品盒","(G)","(g)"],["rose","红玫瑰","(F)","(f)"],["wilted_rose","凋谢的玫瑰","(W)","(w)"],["camera","照相机","(P)","(p)"],["film","电影胶片","(~)"],["cat","猫脸","(@)"],["dog","狗脸","(dog)"],["phone","电话听筒","(T)","(t)"],["lightbulb","灯泡","(I)","(i)"],["note","音符","(8)"],["moon","沉睡的弯月","(S)"],["star","星星","(*)"],["envelope","电子邮件","(E)","(e)"],["clock","时钟","(O)","(o)"],["messenger","MSN Messenger 图标","(M)","(m)"],["53_53","蜗牛","(sn)"],["70_70","黑羊","(bah)"],["55_55","餐盘","(pl)"],["56_56","餐具","(||)"],["57_57","比萨","(pi)"],["58_58","足球","(so)"],["59_59","汽车","(au)"],["60_60","飞机","(ap)"],["61_61","雨伞","(um)"],["62_62","有棕榈树的小岛","(ip)"],["63_63","计算机","(co)"],["64_64","移动电话","(mp)"],["66_66","乌云","(st)"],["73_73","闪电","(li)"],["69_69","金钱","(mo)"]];
		},
		//返回个人信息的User对象
		getMyUserInfo:function()
		{
			new Ajax().get(localip+"data/getmyinfo.php",
				function(o)
				{
					if(!o)return;
					if(!wmT(o.responseXML,"list"))return;
					_me.Profile = _me.Common.getUserFromXml(wmT(o.responseXML,"list").item(0))[0];
				});
		},
		//返回好友信息的User对象
		getFriendUserInfo:function(uid,cb)
		{
			new Ajax().get(localip+"data/getuserinfo.php?id="+uid,cb);
		},
		//返回陌生人信息的User对象
		getCustomUserInfo:function(uid,cb)
		{
			new Ajax().get(localip+"data/getcustominfo.php?id="+uid,cb);
		},
		//返回个人配置
		getMyConfig:function()
		{
			new Ajax().get(localip+"data/getmyconfig.php",
				function(o)
				{
					if(!o)return;
					if(!wmT(o.responseXML,"list"))return;
					_me.Config =_me.Common.getConfigFromXml(wmT(o.responseXML,"list").item(0));
				});
		},
		//返回陌生人列表的User对象数组
		getCustomList:function(id,cb)
		{
			new Ajax().get(localip+"data/getcustom.php?vid="+id,
				function(o)
				{
					if(!o)return;
					if(!wmT(o.responseXML,"list"))return;
					_me.Custom =_me.Common.getCostumFromXml(wmT(o.responseXML,"list").item(0));
					if(cb)cb(o);
				});
		},
		//返回好友列表的User对象数组
		getMyFriendList:function(cb)
		{
			new Ajax().get(localip+"data/getmyfriend.php",
				function(o)
				{
					if(!o)return;
					if(!wmT(o.responseXML,"list"))return;
					_me.Friend =_me.Common.getUserFromXml(wmT(o.responseXML,"list").item(0));
					if(cb)cb(o);
				});
		},
		//返回分组列表的Group对象数组
		getMyGroupList:function(cb)
		{
			new Ajax().get(localip+"data/getmygroup.php",
				function(o)
				{
					if(!o)return;
					if(!wmT(o.responseXML,"list"))return;
					_me.Group = _me.Common.getGroupFromXml(wmT(o.responseXML,"list").item(0));
					if(cb)cb(o);
				});
		},
		//返回消息列表msg对象数组
		getMyMsgList:function(cb)
		{
			new Ajax().get(localip+"data/getmymsg.php?rnd="+Math.random()+"&code="+_me.Sys.Code,cb);
		},
		//修改用户Profile
		setUserProfile:function()  //修改用户状态
		{
			var data = "userface="+_me.Profile.UserFace;
			data+="&username="+_me.Profile.UserName.escapeEx();
			data+="&usersign="+_me.Profile.UserSign.escapeEx();
			data+="&userstatus="+_me.Profile.UserStatus;
			new Ajax().post(localip+"data/service.php?t=4",data);
		},
		//修改用户个性签名，同时发布到微博
		setUsersign:function()
		{
			var data="&usersign="+_me.Profile.UserSign.escapeEx()+"&id="+_me.Profile.UserID;
			new Ajax().post(localip+"data/service.php?t=13",data);
		},
		//登录
		setUserLogin:function(email,pass,us,cb)
		{
			new Ajax().post(localip+"data/service.php?t=0","us="+us+"&username="+email+"&pass="+pass,cb);
		},
		//退出登录
		setUserLogout:function()
		{
			new Ajax().post(localip+"data/service.php?t=2");
		},
		//发送消息
		sendMessage:function(msg)
		{
			new Ajax().post(localip+"data/service.php?t=3","from="+msg.From+"&to="+msg.To+"&content="+msg.Content.escapeEx()+"&type="+msg.Type);
		},
		//接受添加好友请求
		acceptAddFriend:function(uid,cb)
		{
			new Ajax().post(localip+"data/service.php?t=5","to="+uid,cb);
		},
		//删除好友
		deleteFriend:function(uid)
		{
			new Ajax().post(localip+"data/service.php?t=6","to="+uid);
		},
		//修改屏蔽状态
		blockFriend:function(uid,status)
		{
			new Ajax().post(localip+"data/service.php?t=7","to="+uid+"&s="+status);
		},
		//修改好友昵称
		editCustomName:function(uid,name)
		{
			new Ajax().post(localip+"data/service.php?t=8","to="+uid+"&n="+name.escapeEx());
		},
		//修改好友分组
		editUserGroup:function(uid,gid)
		{
			new Ajax().post(localip+"data/service.php?t=12","id="+uid+"&gid="+gid);
		},
		//添加组
		addGroup:function(gname,cb)
		{
			new Ajax().post(localip+"data/service.php?t=9","n="+gname.escapeEx(),cb);
		},
		//删除
		delGroup:function(gid,cb)
		{
			new Ajax().post(localip+"data/service.php?t=10","id="+gid,cb);
		},
		//修改
		editGroup:function(gid,gname)
		{
			new Ajax().post(localip+"data/service.php?t=11","id="+gid+"&n="+gname.escapeEx());
		}
	};
	//操作
	this.CMD = {
		//添加分组
		addGroup:function()
		{
			if(_me.Config.UserPower>2)
			{
				_me.Common.showAlert("匿名用户没有此功能!","提示");
				return;
			}
			_me.Common.showPrompt("","请输入组名",
				function()
				{
					var gname = arguments[2].strip();
					if(gname=="")return;
					if(!_me.Common.getGroupByName(gname))//不存在
					{
						_me.Data.addGroup(gname,
						function(o)
						{
							_me.Data.getMyGroupList(
								function(o)
								{
									_me.Data.getMyFriendList(function(){_me.CMD.renderMyFriend(null,null,!0);});
								});
						});
					}
					else
					{
						_me.Common.showAlert("这个组名已经存在!","提示");
					}
				});
		},
		//编辑分组
		editGroup:function(gid)
		{
			if(gid==1)
			{
				_me.Common.showAlert("不能重命名默认分组!","提示");
				return;
			}
			var g = _me.Common.getGroupById(gid);
			if(!g)return;
			_me.Common.showPrompt(g.Name,"请输入组名",
				function()
				{
					var gname = arguments[2].strip();
					if(gname==g.Name||gname=="")return;
					if(!_me.Common.getGroupByName(gname))//不存在
					{
						g.Name = gname;
						_me.Data.editGroup(gid,gname);
						_me.CMD.renderMyFriend();
					}
					else
					{
						_me.Common.showAlert("这个组名已经存在!","提示");
					}
				});
		},
		//删除分组
		delGroup:function(gid)
		{
			if(gid==1)
			{
				_me.Common.showAlert("不能删除默认分组!","提示");
				return;
			}
			var g = _me.Common.getGroupById(gid);
			_me.Common.showConfirm("确定要删除“"+g.Name+"”这个分组(该组好友会移至默认组)？","提示",
				function()
				{
					if(arguments[2])
					{
						_me.Data.delGroup(gid,
							function(o)
							{
								_me.Data.getMyGroupList(
									function(o)
									{
										_me.Data.getMyFriendList(function(){_me.CMD.renderMyFriend(null,null,!0);});
									});
							});
					}
				});
		},
		//显示联系人卡片
		showCard:function(uid,o)
		{
			var u = uid==_me.Profile.UserID?_me.Profile:_me.Common.getUserFromArr(uid,_me.Friend);
			if(!u)return;
			var wWin = _me.Win;
			var top = Elem.GetY(wm(o),wm("windowContainer"))+2-wm(o).parentNode.parentNode.parentNode.scrollTop;
			var left = wWin.win.Left<233?wWin.win.Left+wWin.win.Width+2:wWin.win.Left-230;
			var oCard = wm("divCardBorder");
			if(!oCard)
			{
				oCard = Elem.New("div","divCardBorder","wCardBorder");
				Elem.Add("windowContainer",oCard);
			}
			var os = oCard.style;
			os.top = top+"px";
			os.left = left+"px";
			Elem.Value(oCard);
			var oCardContent = Elem.New("div","","wCardContainer",_me.Common.createUserItem(3,u));
			var ban = u.IsBlocked?"b":"";
			var img = Elem.New("img","","wCardCloseImage");
			img.src = localip+"images/im/close.jpg";
			img.title = "关闭";
			img.onmouseover = function(){this.src=localip+"images/im/closehover.jpg";};
			img.onmouseout = function(){this.src=localip+"images/im/close.jpg";};
			img.onclick = function(){Elem.Hid("divCardBorder");};
			Elem.Add(oCardContent,img);
			Elem.Add(oCard,oCardContent);
			Elem.Show(oCard);
		},
		//修改用户分组
		eidtUserGroup:function(uid)
		{
			var u = _me.Common.getUserFromArr(uid,_me.Friend);
			if(!u)return;
			_me.Common.showSelect("请选择分组",
				function(id,t)
				{
					var oSel = wm("divSelectId"+id+"Type"+t);
					for(var i=0;i<_me.Group.length;i++)
					{
						var g = _me.Group[i];
						var opt = Elem.New("option");
						opt.value = g.ID;
						opt.text = g.Name;
						oSel.options.add(opt);
					}
					Elem.Value(oSel,u.GroupID);
				},
				function()
				{
					var gid = arguments[2];
					if(gid==""||gid==u.GroupID)return;//无改变
					_me.Data.editUserGroup(uid,gid);
					u.GroupID = gid;
					_me.CMD.renderMyFriend(null,null,!0);
				});
		},
		//修改好友昵称
		editCustomName:function(uid)
		{
			if(_me.Config.UserPower>2)
			{
				_me.Common.showAlert("匿名用户没有此功能!","提示");
				return;
			}
			var u = _me.Common.getUserFromArr(uid,_me.Friend);
			if(!u)return;
			_me.Common.showPrompt(u.CustomName,"请输入昵称",
				function()
				{
					var name = arguments[2].trim();
					if(name!="")
					{
						if(name==u.CustomName)return;//无改变
						_me.Data.editCustomName(uid,name);
						u.CustomName = name;
						_me.CMD.renderMyFriend();
					}
					else//清除昵称
					{
						_me.Data.editCustomName(uid,"");
						u.CustomName = u.UserName;
						_me.CMD.renderMyFriend();
					}
				});
		},
		//显示聊天记录
		showMsgHistory:function(uid)
		{
			var url = localip+"page/message.php?v="+Math.random();
			if(uid)url+="&id="+uid;
			_me.Common.showLink(550,450,50,(Elem.Width()-450)/2,9,"聊天记录",url,"im/toolmsghistory_s.png");
		},
		//显示管理页面
		showManage:function(uid)
		{
			var url = localip+"page/usermanage.php?v="+Math.random();
			_me.Common.showLink(550,450,50,(Elem.Width()-450)/2,12,"管理",url,localip+"toolmanage.gif");
		},
		//屏蔽好友
		blockFriend:function(uid,isblock)
		{
			if(_me.Config.UserPower>2)
			{
				_me.Common.showAlert("匿名用户没有此功能!","提示");
				return;
			}
			_me.Data.blockFriend(uid,isblock);
			var users = [];
			users = _me.Friend;
			var u = _me.Common.getUserFromArr(uid,users);
			u.IsBlocked = isblock==1;
			if(wm("wChatButtonBlockId"+uid+"Type1"))
			{
				var oBtn = wm("wChatButtonBlockId"+uid+"Type1");
				var isblock = 3-parseInt(oBtn.getAttribute("b"));
				wmT(oBtn,"img")[0].src = isblock == 1?localip+"images/im/chatbuttoncancelblock.png":localip+"images/im/chatbuttonblock.png";
				wmT(oBtn,"img")[0].title = isblock == 1?"取消阻止此联系人":"阻止此联系人";
				oBtn.setAttribute("b",isblock);
			}
			_me.CMD.renderMyFriend();
		},

		//删除好友
		delFriend:function(uid)
		{
			if(_me.Config.UserPower>2)
			{
				_me.Common.showAlert("匿名用户没有此功能!","提示");
				return;
			}
			if(1==_me.Friend.length){
				_me.Common.showAlert("你只有一位好友，不能删除哦!","提示");
				return;
			}
			var users = [];
			users = _me.Friend;
			var u = _me.Common.getUserFromArr(uid,users);
			_me.Common.showConfirm("确定要删除“"+u.CustomName+"”这位好友？","提示",
			function()
			{
				if(arguments[2])
				{
					var wChat = WinManage.GetWindow(uid,1);
					if(wChat)wChat.win.Close();
					_me.Friend.remove(u);
					_me.CMD.renderMyFriend();
					_me.Data.deleteFriend(uid);
				}
			});
		},
		//循环获取消息
		getMsgInterval:function()
		{
			if(!_me.Sys.IntervalID)
			{
				_me.Sys.IntervalID = setInterval(
					function()
					{
						_me.Data.getMyMsgList(
							function(o)
							{
								if(!o)return;
								if(!wmT(o.responseXML,"list"))return;
								var msgs = _me.Common.getMsgFromXml(wmT(o.responseXML,"list").item(0));
								if(msgs)
								{
									for(var i=0;i<msgs.length;i++)
									{
										_me.CMD.showChatContent(msgs[i].From,msgs[i]);
									}
								}
							});
					}
					,_me.Sys.IntervalTime);
			}
		},
		//停止循环获取消息
		stopMsgInterval:function()
		{
			clearInterval(_me.Sys.IntervalID);
			_me.Sys.IntervalID = null;
		},
		//显示注册窗体
		showRegWindow:function()
		{
			var wLogin = WinManage.GetWindow(6,3);
			if(wLogin)wLogin.win.Minimize();
			_me.Common.showLink(210,450,50,(Elem.Width()-210)/2,7,"注册新帐号",localip + "page/reg.php",null, //注册页面弹出
				function()
				{
					if(wLogin.isMin)wLogin.win.Minimize();
				});
		},
		//登录窗口初始化
		intLoginWindow:function()
		{
			var wMain = WinManage.GetWindow(0,2);//存在主窗口
			if(wMain)
			{
				if(wMain.isMin)wMain.win.Minimize();
				wMain.win.Focus();
				return;
			}
			var wLogin = WinManage.GetWindow(6,3);//存在登录窗口
			if(wLogin)
			{
				if(wLogin.isMin)wLogin.win.Minimize();
				wLogin.win.Focus();
				return;
			}
			var w = new WebForm();
			w.Title = "WebIM "+_me.Version;
			w.Icon = "im/icon.png";
			w.Type = 3;
			w.UserID = 6;
			w.Height = 450;
			w.Width = 210;
			w.Left = 350;
			w.ContentUrl = localip+"layout/winlogin.htm";
			w.Resizeable = !!0;
			w.RepaintMethod = function(w,h,id,t){wm("wOtherMainId"+id+"Type"+t).style.height = h+"px";};
			w.LoadedCallback = function(id,t)
			{
				wm("divStatusId6Type3").onclick = function(e)
				{
					var m = new SysMenu("menuLoginStatus6Type3");
					m.Data = ["联机|_webIM.CMD.changeLoginStatus(0)|"+localip+"images/im/m0.png",
						"忙碌|_webIM.CMD.changeLoginStatus(1)|"+localip+"images/im/m1.png",
						"马上回来|_webIM.CMD.changeLoginStatus(2)|"+localip+"images/im/m2.png",
						"离开|_webIM.CMD.changeLoginStatus(3)|"+localip+"images/im/m2.png",
						"通话中|_webIM.CMD.changeLoginStatus(4)|"+localip+"images/im/m2.png",
						"外出就餐|_webIM.CMD.changeLoginStatus(5)|"+localip+"images/im/m2.png",
						"隐身|_webIM.CMD.changeLoginStatus(6)|"+localip+"images/im/m3.png"];
					m.E = e;
					m.HasIcon = true;
					m.Width = 120;
					m.Top = w.Top+157;
					m.Left = w.Left+102;
					m.Show();
				};
				
				Elem.Value("tbUsernameId6Type3",decodeURI(Other.GetCookie("strusername")));
				Elem.Value("tbPassId6Type3",Other.GetCookie("strpass"));
				if(Other.GetCookie("strusername").trim()!=""){
					Elem.Show(wm("linkDelCookieId6Type3").parentNode);
				}
				wm("cbSaveUserId6Type3").checked = Other.GetCookie("saveusername")=="1";
				wm("cbSavePassId6Type3").checked = Other.GetCookie("savepass")=="1";
				wm("cbAutoLoginId6Type3").checked = Other.GetCookie("autologin")=="1";
				if(Other.GetCookie("loginstatus").trim()!="")_webIM.CMD.changeLoginStatus(parseInt(Other.GetCookie("loginstatus")));
				new CheckBox("cbSaveUserId6Type3","保存我的信息(B)").Render();
				new CheckBox("cbSavePassId6Type3","记住我的密码(R)").Render();
				new CheckBox("cbAutoLoginId6Type3","自动为我登录(N)").Render();
				wm("tbPassId6Type3").onkeydown = function(e)
				{
					var e = e||event;
					if(e.keyCode==13)//回车
					{
						_me.CMD.loginWebIM();
					}
				}
				wm("btnLoginId6Type3").onclick=_me.CMD.loginWebIM;
				wm("linkDelCookieId6Type3").onclick = function()
				{
					Other.SetCookie("strusername","");
					Other.SetCookie("strpass","");
					Other.SetCookie("saveusername","2");
					Other.SetCookie("savepass","2");
					Other.SetCookie("autologin","2");
					Other.SetCookie("loginstatus","0");
					_me.CMD.destroyMainWindow();
					IntWebIM();
				};
				if(Other.GetCookie("autologin")=="1")
				{
					_me.CMD.loginWebIM();//自动登录
				}
			};
			w.CloseCallback = _me.CMD.destroyMainWindow;
			w.Show();
			w.Focus();
			
		},
		//登录。。。。。。。
		loginWebIM:function()
		{
			var w = WinManage.GetWindow(6,3).win;
			var user = wmF("tbUsernameId6Type3").trim(); //得到用户名,id为 tbUsernameId6Type3
			var pass = wmF("tbPassId6Type3").trim();  //得到密码，  id为 tbPassId6Type3
			if(user=="")
			{
				_me.Common.showAlert("请输入你的用户名!","提示",
					function()
					{
						w.Focus();
						wm("tbUsernameId6Type3").focus();
					});
				return;
			}
			if(pass=="")
			{
				_me.Common.showAlert("请输入你的密码!","提示",
					function()
					{
						w.Focus();
						wm("tbPassId6Type3").focus();
					});
				return;
			}
			var us = wm("divStatusId6Type3").getAttribute("us");
			Elem.Toggle("divLoginId6Type3","divLoginingId6Type3");
			_me.Data.setUserLogin(user,pass,us,function(o)
			{
				var result = parseInt(Xml.First(wmT(o.responseXML,"result").item(0),"num"));
				MyUserid = parseInt(Xml.First(wmT(o.responseXML,"result").item(0),"myid"));//Myuserid


				if(result==1)//登录成功
				{
					Other.SetCookie("strusername",wm("cbSaveUserId6Type3").checked?encodeURI(user):"");
					Other.SetCookie("strpass",wm("cbSavePassId6Type3").checked?pass:"");
					Other.SetCookie("saveusername",wm("cbSaveUserId6Type3").checked?"1":"2");
					Other.SetCookie("savepass",wm("cbSavePassId6Type3").checked?"1":"2");
					Other.SetCookie("autologin",wm("cbAutoLoginId6Type3").checked?"1":"2");
					Other.SetCookie("loginstatus",us);
					w.Close();
					_me.Sys.Code = parseInt(Xml.First(wmT(o.responseXML,"result").item(0),"code"));
					_me.CMD.intMainWindow(w.Top,w.Left);
	
				}
				else
				{
					w.Focus();
					wm("tbUsernameId6Type3").focus();
					_me.Common.showAlert("登录失败,请检查输入的帐户信息是否正确!","提示");
					Elem.Toggle("divLoginId6Type3","divLoginingId6Type3");
					return;
				}
			});
		},
		//主窗体初始化
		intMainWindow:function(top,left)
		{
			var w = new WebForm();
			w.Title = "<span style='color:#fff'>WebIM "+_me.Version+"</span>";
			w.Icon = "im/icon.png";
			w.Type = 2;
			w.Height = 550;
			w.Width = 260;
			w.Top = top||null;
			w.Left = left||260;
			w.MinHeight = 450;
			w.MinWidth = 210;
			w.RepaintMethod = function(w,h,id,t)
			{
				wm("wMainMainId"+id+"Type"+t).style.height = (h-151)+"px";
				wm("wMainUserInfoRightId"+id+"Type"+t).style.width = (w-82)+"px";
				wm("wMainSearchUserId"+id+"Type"+t).style.width = (w-80)+"px";
				wm("inputSearchId"+id+"Type"+t).style.width = (w-95)+"px";
				wm("txtUserSignId"+id+"Type"+t).style.width = (w-85)+"px";
			};
			w.ClosingCallback = function()
			{
				_me.CMD.stopMsgInterval();//暂停消息定时器
				_me.Common.showConfirm("真的要退出？","提示",
				function()
				{
					if(typeof aWebimSwf == 'object'){
						aWebimSwf.stop();
						aWebimSwf.close();
					}
					if(arguments[2])
					{
						_me.Data.setUserLogout();
						_me.Win.win.ClosingCallback = null;
						_me.Win.win.Close();
					}
					else
					{
						_me.CMD.getMsgInterval();//打开消息定时器
					}
				});
			};
			w.CloseCallback = function()
			{
				_me.CMD.destroyMainWindow();
			};
			w.LoadedCallback = function(id,t)
				{
					w.ShowLoading();
					_me.Win = WinManage.GetWindow(id,t);
					_me.Data.getMyConfig();
					_me.Data.getMyUserInfo();
					_me.Data.getMyGroupList();
					_me.Data.getMyFriendList();
					if(Customid != "")
					{
						_me.Data.getCustomList(Customid);//生成临时会话
					}
					var intInteralID = setInterval(
						function()
						{
							if(_me.Config&&_me.Profile&&_me.Group&&_me.Friend)
							{
								clearInterval(intInteralID);
								_me.CMD.renderMyUserInfo();
								_me.CMD.renderMyFriend();
								_me.CMD.getMsgInterval();
								wm("wMainUserSignId"+id+"Type"+t).onclick = function()
								{
									Elem.Show("txtUserSignId"+id+"Type"+t);
									Elem.Value("txtUserSignId"+id+"Type"+t,_me.Profile.UserSign);
									wm("txtUserSignId"+id+"Type"+t).focus();
									wm("txtUserSignId"+id+"Type"+t).onblur = function()
									{
										var sign = wmF(this).trim();
										if(sign!=""&&_me.Profile.UserSign!=sign)//签名有更改就需要update
										{
											_me.Profile.UserSign = sign;
											_me.CMD.renderMyUserInfo();
											_me.Data.setUsersign();
										}
										Elem.Hid("txtUserSignId"+id+"Type"+t);
									};
								};
								wm("wMainMainId"+id+"Type"+t).onclick = function(e)
								{
									var e = e||window.event;
									var tar = e.srcElement||e.target;
									if(tar)
									{

									}
								};
								wm("wMainUserNameId"+id+"Type"+t).parentNode.onclick = function(e)//在线状态菜单
								{
									var m = new SysMenu("menuUserNameId"+id+"Type"+t);
									m.Data = ["联机|_webIM.CMD.changeUserStatus(0)|"+localip+"images/im/m0.png",
											"忙碌|_webIM.CMD.changeUserStatus(1)|"+localip+"images/im/m1.png",
											"马上回来|_webIM.CMD.changeUserStatus(2)|"+localip+"images/im/m2.png",
											"离开|_webIM.CMD.changeUserStatus(3)|"+localip+"images/im/m2.png",
											"通话中|_webIM.CMD.changeUserStatus(4)|"+localip+"images/im/m2.png",
											"外出就餐|_webIM.CMD.changeUserStatus(5)|"+localip+"images/im/m2.png",
											"隐身|_webIM.CMD.changeUserStatus(6)|"+localip+"images/im/m3.png",
											"",
											"注销|_webIM.CMD.logoutWebIM()|"+localip+"images/im/m4.png"];
									m.E = e;
									m.HasIcon = true;
									m.Width = 120;
									m.Top = w.Top+59;
									m.Left = w.Left+80;
									m.Show();
								};
								wm("inputSearchId"+id+"Type"+t).onfocus = function()//搜索好友
								{
									if(parseInt(this.getAttribute("b"))==1)return;
									var value = wmF(this);
									var IntID = setInterval(
										function()
										{
											if(value != wmF("inputSearchId"+id+"Type"+t))
											{
												value = wmF("inputSearchId"+id+"Type"+t);
												_me.CMD.searchMyFriend(value);
											}
										},50);
									this.setAttribute("b","1");
									this.onblur = function()
									{
										this.setAttribute("b","2");
										clearInterval(IntID);
									};
								};
								wm("imgSearchId"+id+"Type"+t).onclick = function()//清除搜索图片
								{
									Elem.Hid("imgSearchId"+id+"Type"+t);
									Elem.Value("inputSearchId"+id+"Type"+t);
									_me.CMD.renderMyFriend();
								};
								wm("wMainAddFriendId"+id+"Type"+t).onclick = function()//添加联系人窗口
								{
									_me.Common.showLink(350,285,w.Top,w.Left<355?w.Left+w.Width+2:w.Left-352,1,"添加联系人",localip + "page/addfriend.php?v="+Math.random(),"im/tooladdfriend.png");
								};
								wm("wMainOptionId"+id+"Type"+t).onclick = function()//选项窗口
								{
									_me.Common.showLink(420,400,w.Top,w.Left<425?w.Left+w.Width+2:w.Left-422,8,"设置",localip + "page/option.php?v="+Math.random(),"im/tooloption_s.png");
								};
								wm("wMainProfileId"+id+"Type"+t).onclick = function()//个人信息窗口
								{
									_me.Common.showLink(334,422,w.Top,w.Left<355?w.Left+w.Width+2:w.Left-352,10,"编辑个人资料",localip + "page/profile.php?v="+Math.random(),"im/toolprofile_s.png");
								};
								wm("wMainShowHistoryId"+id+"Type"+t).onclick = function()//聊天记录窗口
								{
									_me.CMD.showMsgHistory();
								};
								wm("wMainShowFocusId"+id+"Type"+t).onclick = function()//今日焦点窗口
								{
									_me.Common.showLink(400,400,w.Top,w.Left<405?w.Left+w.Width+2:w.Left-402,2,"今日焦点",localip + "page/todayfocus.php?v="+Math.random(),"im/toolshowfocus_s.png");
								};
								wm("wMainUserFaceId"+id+"Type"+t).onclick = function()//显示自己的卡片
								{
									_me.CMD.showCard(_me.Profile.UserID,this);
								};
								wm("wMainListTypeId"+id+"Type"+t).onclick = function(e)//添加联系人按钮
								{
									var m = new SysMenu("menuUserNameId"+id+"Type"+t);
									m.Data = ["按状态排序|_webIM.CMD.renderMyFriend(1,_webIM.Config.DisType,true)",
											"按组排序|_webIM.CMD.renderMyFriend(2,_webIM.Config.DisType,true)",
											"",
											"显示简要信息|_webIM.CMD.renderMyFriend(_webIM.Config.OrderType,1,true)",
											"显示详细信息|_webIM.CMD.renderMyFriend(_webIM.Config.OrderType,2,true)"];
									m.Data[_me.Config.OrderType-1]+="|"+localip+"images/selected.gif|"+localip+"images/selectedhover.gif";
									m.Data[_me.Config.DisType+2]+="|"+localip+"images/selected.gif|"+localip+"images/selectedhover.gif";
									m.E = e;
									m.HasIcon = true;
									m.Width = 120;
									m.Top = w.Top+125;
									m.Left = w.Left+w.Width-31;
									m.Show();
								};
								if(_me.Config.UserPower<2)
								{
									var o = wm("wMainManageId"+id+"Type"+t);
									Elem.Show(o);
									o.onclick = _me.CMD.showManage;
								}
								if(!wm("divFaceList"))//缓存聊天表情
								{
									var oDiv = Elem.New("div","divFaceList","wChatFaceContainer");
									var faces = [];
									faces = _me.Data.getMsnFaceInfo();
									for(var i=0;i<faces.length;i++)
									{
										var face = faces[i];
										var oItem = Elem.New("div","","wChatFaceItem","<img f='"+face[2]+"' src='"+localip+"msnface/"+face[0]+".gif' title='"+face[1]+" "+face[2]+"'/>");
										oItem.onmouseover = function(){this.className="wChatFaceItem wChatFaceItemHover";};
										oItem.onmouseout  = function(){this.className="wChatFaceItem";};
										oItem.onclick = function()
										{
											var chatid = parseInt(window.cWindow.replace("winChat",""));
											if(!chatid)return;
											Elem.Append("wChatInputId"+chatid+"Type1",wmT(this,"img")[0].getAttribute("f"));
											Elem.Hid("divFaceList");
										};
										Elem.Add(oDiv,oItem);
									}
									Elem.Add("windowContainer",oDiv);
								}
								if(!wm("divUploadForm")){//上传图片和文件
									var oDiv = Elem.New("div","divUploadForm","wChatFaceContainer");
									var oFrame = Elem.New("iframe","frameUploadForm");
									oFrame.width = "100%";
									oFrame.height = "100%";
									oFrame.setAttribute("frameborder","0");
									oFrame.setAttribute("border","0");
									oFrame.setAttribute("scrolling","no");
									oFrame.setAttribute("allowtransparency","yes");
									Elem.Add(oDiv,oFrame);
									Elem.Add("windowContainer",oDiv);
								}
								w.HideLoading();
								if(Customid != 10000)
						        {
						            _webIM.Common.customChat();
						        }
							}
						},50);
				};
			w.Show();

		},
		//注销操作
		logoutWebIM:function()
		{
			_me.CMD.stopMsgInterval();//暂停消息定时器
			Other.SetCookie("autologin","2");
			_me.Data.setUserLogout();
			_me.Win.win.ClosingCallback = null;
			_me.Win.win.Close();
			IntWebIM();
		},
		//填充本人信息
		renderMyUserInfo:function()
		{
			var user = _me.Profile;
			var id = _me.Win.id;
			var t = _me.Win.type;
			wm("wMainUserFaceId"+id+"Type"+t).src = localip+"userface/"+user.UserFace;
			wm("wMainUserNameId"+id+"Type"+t).innerHTML = user.UserName+" <span style=\"font-size:12px;color:#fff\">["+_me.Common.getUserStatusStr(user.UserStatus)+"]</span>";
			wm("wMainUserSignId"+id+"Type"+t).innerHTML = user.UserSign;
		},
		//修改UserStatus
		changeUserStatus:function(n)
		{
			if(_me.Profile.UserStatus == n)return;//不用修改
			_me.Profile.UserStatus = n;
			_me.Profile.OnlineStatus = _me.Common.getOnlineStatus(n);
			_me.CMD.renderMyUserInfo();
			_me.Data.setUserProfile();
		},
		//修改登录状态
		changeLoginStatus:function(n)
		{
			wm("divStatusId6Type3").innerHTML = _me.Common.getUserStatusStr(n);
			wm("divStatusId6Type3").setAttribute("us",n);
		},
		//销毁主窗体，并清除子窗体
		destroyMainWindow:function()
		{
			clearInterval(WinManage.WinListInteralID);
			for(var f = 0 ;f < WinManage.WindowsList.length;f++)
			{
				var w = WinManage.WindowsList[f];
				Elem.Del(WinManage.GetObjByWindow(w));
			}
			WinManage.WindowsList.clear();
			Elem.Del("windowContainerBorder");
			window.onscroll = window.onresize = null;
		},
		//搜索好友
		searchMyFriend:function(k)
		{
			var id = _me.Win.id;
			var t = _me.Win.type;
			if(k=="")
			{
				Elem.Hid("imgSearchId"+id+"Type"+t);
				_me.CMD.renderMyFriend();
			}
			else
			{
				var obj = wm("wMainMainId"+id+"Type"+t);
				Elem.Show("imgSearchId"+id+"Type"+t);
				Elem.Value(obj);//清空
				var result = _me.Common.searchFriendList(k);
				if(result&&result.length>0)
				{
					var title = Elem.New("div","","","<div class=\"wMainUserItemText\" style=\"padding-left:20px;width:100%;color:#aca899\">找到:</div>");
					title.style.height = "26px";
					var strHtml = new StringBuilder();
					for(var i=0;i<result.length;i++)
					{
						var u = result[i];
						strHtml.add(_me.Common.createUserItem(_me.Config.DisType,u));
					}
					var container = Elem.New("div","wMainUserContainerId"+id+"Type"+t+"Search","wMainUserContainer",strHtml.toString());
					Elem.Add(obj,title,container);
				}
				else
				{
					Elem.Value(obj,"<div class=\"wMainUserItemText\" style=\"padding:10px 0 0 10px;width:100%;\">没有符合您的搜索条件的联系人。</div>");
				}
			}
		},
		//填充好友列表
		renderMyFriend:function(orderType,disType,clearSearch)
		{
			var id = _me.Win.id;
			var t = _me.Win.type;
			var searchKey = wmF("inputSearchId"+id+"Type"+t);
			if(searchKey!="") //搜索框不为空
			{
				if(clearSearch) //清除
				{
					Elem.Value("inputSearchId"+id+"Type"+t);
					Elem.Hid("imgSearchId"+id+"Type"+t);
				}
				else
				{
					_me.CMD.searchMyFriend(searchKey);
					return;
				}
			}
			if(orderType&&disType)
			{
				if(orderType!=_me.Config.OrderType||disType!=_me.Config.DisType)
				{
					_me.Config.OrderType = orderType;
					_me.Config.DisType = disType;
				}
				else
				{
					return;//不需要重新填充
				}
			}
			_me.Common.sortFriendList();
			var obj = wm("wMainMainId"+id+"Type"+t);
			var nullGroupMsg = "<div class=\"wMainUserItemText\" style=\"padding-left:25px;width:100%;color:#aca899\">此组中没有联系人</div>";
			Elem.Value(obj);
			var itemHeight = _me.Config.DisType==1?26:63;
			var groupUsers = {};
			if(_me.Config.OrderType == 1)
			{
				_me.Common.addUserHeader(obj,"联机",0);
				_me.Common.addUserHeader(obj,"脱机",1);
				var num = [0,0];
				for(var i=0;i<_me.Friend.length;i++)
				{
					var u = _me.Friend[i];
					var no = u.OnlineStatus==3?1:0;
					if(!(no in groupUsers))groupUsers[no]=[];
					groupUsers[no].add(u);
					num[no]++;
				}
				for(var i=0;i<num.length;i++)
				{
					if(num[i]==0)
					{
						Elem.Value("wMainUserContainerId"+id+"Type"+t+"No"+i,nullGroupMsg);
						wm("wMainUserContainerId"+id+"Type"+t+"No"+i).style.height = "26px";
						continue;
					}
					var strHtml = new StringBuilder();
					for(var q=0;q<groupUsers[i].length;q++)
					{
						strHtml.add(_me.Common.createUserItem(_me.Config.DisType,groupUsers[i][q]));
					}
					Elem.Value(wm("wMainUserContainerId"+id+"Type"+t+"No"+i),strHtml.toString());
					wm("wMainUserHeaderId"+id+"Type"+t+"No"+i).innerHTML +=" ( "+num[i]+" ) ";
					wm("wMainUserContainerId"+id+"Type"+t+"No"+i).style.height = num[i]*itemHeight+"px";
				}
			}
			else
			{
				var num1 = {},num2 = {};
				for(var i=0;i<_me.Group.length;i++)
				{
					var g = _me.Group[i];
					_me.Common.addUserHeader(obj,g.Name,g.ID);
					groupUsers[g.ID]=[];
					num1[g.ID]=0;
					num2[g.ID]=0;
				}
				for(var i=0;i<_me.Friend.length;i++)
				{
					var u = _me.Friend[i];
					groupUsers[u.GroupID].add(u);
					num1[u.GroupID]++;
					if(u.OnlineStatus!=3)num2[u.GroupID]++;
				}
				for(var i=0;i<_me.Group.length;i++)
				{
					var gid = _me.Group[i].ID;
					if(num1[gid]==0)
					{
						Elem.Value("wMainUserContainerId"+id+"Type"+t+"No"+gid,nullGroupMsg);
						wm("wMainUserContainerId"+id+"Type"+t+"No"+gid).style.height = "26px";
						continue;
					}
					var strHtml = new StringBuilder();
					for(var q=0;q<groupUsers[gid].length;q++)
					{
						strHtml.add(_me.Common.createUserItem(_me.Config.DisType,groupUsers[gid][q]));
					}
					Elem.Value(wm("wMainUserContainerId"+id+"Type"+t+"No"+gid),strHtml.toString());
					wm("wMainUserHeaderId"+id+"Type"+t+"No"+gid).innerHTML +=" ( "+num2[gid]+" / "+num1[gid]+" ) ";
					wm("wMainUserContainerId"+id+"Type"+t+"No"+gid).style.height = num1[gid]*itemHeight+"px";
				}
			}
//			if(Customid != 10000)
//	        {
//	            _webIM.Common.customChat();
//	        }
		},
		
		//显示一条消息,uid为接受者的userid字段,msg消息体
		showChatContent:function(uid,msg)
		{
			_me.CMD.stopMsgInterval();
			
			var users =  _me.Friend;
			var custom = _me.Custom;			
			users.add(_me.Profile);//添加自己进入好友列表
			
			var userFrom = _me.Common.getUserFromArr(msg.From,users);//发送人信息
			if(!userFrom)
			{
				userFrom = _me.Common.getCustomFromArr(msg.From,custom);//发送人信息		
				if(!userFrom)
				{
					_me.Data.getCustomUserInfo(msg.From,
							function(o)
							{
								if(!o)return;
								if(!wmT(o.responseXML,"list"))return;
								var profile = _me.Common.getCostumFromXml(wmT(o.responseXML,"list").item(0))[0];
								if(!_me.Common.getCustomFromArr(msg.From,custom))//当前列表中不存在则添加
								{
									
									custom.add(profile);
									userFrom = _me.Common.getCustomFromArr(msg.From,custom);//发送人信息								
								}
							});
				}
			}
			
			var userTo = _me.Common.getUserFromArr(msg.To,users);
			users.remove(_me.Profile);
			if(msg.Type<3)
			{
				_me.CMD.openChatWindow(uid,false);//打开与uid聊天窗口
				var _interID = setInterval(function()
						{
							var objChat = wm("wChatViewId"+uid+"Type1");
							if(objChat)
							{
								clearInterval(_interID);
								var winChat = WinManage.GetWindow(uid,1);
								winChat.win.Flash();//提示有新消息
								switch(parseInt(msg.Type))
								{
									case 1://文本消息
										var msgTitle = userFrom.CustomName+" 说";
										if(_me.Config.MsgShowTime==1)
										{
											var msgTime = !msg.AddTime?new Date():new Date(Date.parse(msg.AddTime.replace(/-/g,"/")));
											msgTitle+=" ("+msgTime.getHours().toString().padLeft("0",2)+"："+msgTime.getMinutes().toString().padLeft("0",2)+")";
										}
										msgTitle +="：";
										Elem.Add(objChat,Elem.New("div",null,"wChatMsgTitle",msgTitle));
										Elem.Add(objChat,Elem.New("div",null,"wChatMsgContent",_me.Common.replaceFaceFromStr(msg.Content).replace(/{br}/img,"<br />")));
										if(msg.From!=_me.Profile.UserID)_me.Common.playSound("newmessage");
										_me.CMD.getMsgInterval();
										break;
									case 2://特殊消息
										arrContent = msg.Content.split('#');
										webim_log("收到type=2的消息，参数为："+arrContent);
										switch(arrContent[0]){
										case "VIDEO":
											strType="视频";
										break;
										case "AUDIO":
											strType="音频";
										break;
										}
										switch(arrContent[0])
										{
											case "FLASH"://闪屏
												var oChild = objChat.childNodes;
												if(oChild.length==0||(oChild.length>0&&oChild[oChild.length-1].className!="wChatMsgSplit"))Elem.Add(objChat,Elem.New("div",null,"wChatMsgSplit"));
												Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"发送了一个闪屏振动"),Elem.New("div",null,"wChatMsgSplit"));
												WinManage.FlashWindow(WinManage.GetWindow(uid,1));
												_me.Common.playSound("flash");
											break;
											case "VIDEO"://视频
											case "AUDIO":
												var oChild = objChat.childNodes;
												if(oChild.length==0||(oChild.length>0&&oChild[oChild.length-1].className!="wChatMsgSplit"))Elem.Add(objChat,Elem.New("div",null,"wChatMsgSplit"));
												switch(arrContent[1]){
												case 'invite':
													if(_me.Profile.UserID == msg.From){
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial","我发送了一个"+strType+"邀请，地址为："+arrContent[2]),Elem.New("div",null,"wChatMsgSplit"));
														aWebimSwf.url=arrContent[2];
														aWebimSwf.UserID=_me.Profile.UserID;
														aWebimSwf.UserName=_me.Profile.UserName;
														aWebimSwf.remoteID = msg.To;
														aWebimSwf.type = arrContent[0];
														aWebimSwf.start();
														//WinManage.VideoChatWindow(uid,1);
													}else{
														if(true != aWebimSwf.available() ){
															strAccept = 'reject#'+aWebimSwf.available();
															uid=msg.From;
															var msg2 = new _me.Model.Msg(_me.Profile.UserID,uid,"VIDEO#"+strAccept,2,2);
															_webIM.Data.sendMessage(msg2);
														}else{
															
															Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"发送了一个"+strType+"邀请，地址为："+arrContent[2]),Elem.New("div",null,"wChatMsgSplit"));
															aWebimSwf.url=arrContent[2];
															aWebimSwf.UserID=_me.Profile.UserID;
															aWebimSwf.UserName=_me.Profile.UserName;
															aWebimSwf.remoteID = msg.From;
															aWebimSwf.type = arrContent[0];
															_me.Common.showConfirm(userFrom.CustomName+"邀请您进行"+strType+"聊天，是否接受？","是否接受"+strType+"邀请",
																function()
																{
																	if(aWebimSwf.remoteID=="undefined"){//如果对方已经中止，则不再继续
																		_me.Common.showAlert("对方已经中止聊天","提示");
																		return ;
																	}
																	if(arguments[2] )
																	{
																		strAccept="accept";
																		aWebimSwf.start();
																	}else{
																		strAccept="reject";
																		aWebimSwf.stop();
																		aWebimSwf.close();
																	}
																	uid=msg.From;
																	var msg2 = new _me.Model.Msg(_me.Profile.UserID,uid,arrContent[0]+"#"+strAccept,2,2);
																	_webIM.CMD.showChatContent(uid,msg2);
																	_webIM.Data.sendMessage(msg2);
																});
														}
													}
												break;
												case 'accept':
													if(_me.Profile.UserID == msg.From){
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial","我接受了"+strType+"邀请"),Elem.New("div",null,"wChatMsgSplit"));
													}else{
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"接受了"+strType+"邀请"),Elem.New("div",null,"wChatMsgSplit"));
													}
												break;
												case 'reject':
													if(_me.Profile.UserID == msg.From){
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial","我拒绝了"+strType+"邀请"),Elem.New("div",null,"wChatMsgSplit"));
													}else{
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"拒绝了"+strType+"邀请"),Elem.New("div",null,"wChatMsgSplit"));
														aWebimSwf.close();
													}
												break;
												case 'stop':
													if(_me.Profile.UserID == msg.From){
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial","我中止了"+strType+"聊天"),Elem.New("div",null,"wChatMsgSplit"));
													}else{
														Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"中止了"+strType+"聊天"),Elem.New("div",null,"wChatMsgSplit"));
													}
													aWebimSwf.stop();
													aWebimSwf.close();
												break;
												}
											break;
											case "VIDIO"://视频
												var oChild = objChat.childNodes;
												if(oChild.length==0||(oChild.length>0&&oChild[oChild.length-1].className!="wChatMsgSplit"))Elem.Add(objChat,Elem.New("div",null,"wChatMsgSplit"));
												Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"发送了一个视频邀请"),Elem.New("div",null,"wChatMsgSplit"));												
												//WinManage.VidioWindow(uid,1);
												//_me.Common.playSound("flash");//播放声音												
												//callApp2(_me.Win.id);
												
											break;
											case "FLASHOK"://flash准备完成
												
												var oChild = objChat.childNodes;
												if(oChild.length==0||(oChild.length>0&&oChild[oChild.length-1].className!="wChatMsgSplit"))Elem.Add(objChat,Elem.New("div",null,"wChatMsgSplit"));
												Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+" flash视频准备完成"),Elem.New("div",null,"wChatMsgSplit"));												
												
												Visitorflash = "ok";
												
												//if(Visitorflash=="ok" || myflash == "ok")
												//{
												var x = thisMovie('demo').flashallok(Visitorflash,myflash);
												//}
												
												
												//WinManage.VoiceWindow(uid,1);
												//_me.Common.playSound("flash");//播放声音												
												//callApp2(_me.Win.id);
												
											break;
											case "VOICE"://音频
												
												var oChild = objChat.childNodes;
												if(oChild.length==0||(oChild.length>0&&oChild[oChild.length-1].className!="wChatMsgSplit"))Elem.Add(objChat,Elem.New("div",null,"wChatMsgSplit"));
												Elem.Add(objChat,Elem.New("div",null,"wChatMsgSpecial",userFrom.CustomName+"发送了一个音频邀请"),Elem.New("div",null,"wChatMsgSplit"));												
												WinManage.VoiceWindow(uid,1);
												//_me.Common.playSound("flash");//播放声音												
												//callApp2(_me.Win.id);
												
											break;
										}
										_me.CMD.getMsgInterval();
								}
								objChat.scrollTop = objChat.scrollHeight;
							}
						},100);
			}
			else
			{
				switch(parseInt(msg.Type))
				{
					case 3://添加好友
						_me.Data.getFriendUserInfo(msg.From,
							function(o)
							{
								if(!o)return;
								if(!wmT(o.responseXML,"list"))return;
								var profile = _me.Common.getUserFromXml(wmT(o.responseXML,"list").item(0))[0];
								if(!_me.Common.getUserFromArr(msg.From,users))//当前列表中不存在则添加
								{
									_me.Friend.add(profile);
									_me.CMD.renderMyFriend();
								}
								_me.CMD.getMsgInterval();
							});
						break;
					case 4://删除好友
						_me.Friend.remove(userFrom);
						_me.CMD.renderMyFriend();
						
						_me.CMD.getMsgInterval();
						break;
					case 5://用户信息改变
						_me.Friend.remove(userFrom);
						_me.Data.getFriendUserInfo(msg.From,
							function(o)
							{
								if(!o)return;
								if(!wmT(o.responseXML,"list"))return;
								var result =  _me.Common.getUserFromXml(wmT(o.responseXML,"list").item(0));
								if(!result||result.length<1)return;
								var profile =result[0];
								_me.Friend.add(profile);
								_me.CMD.renderMyFriend();
								_me.Common.playSound("friendonline");
								_me.CMD.getMsgInterval();
							});
						break;
					case 7://加好友请求
						_me.Common.showConfirm(msg.Content+"请求加您为好友!同意？","提示",
							function()
							{
								if(arguments[2])
								{
									_me.Data.acceptAddFriend(msg.From,function()
									{
										_me.Data.getFriendUserInfo(msg.From,
										function(o)
										{
											if(!o)return;
											if(!wmT(o.responseXML,"list"))return;
											var profile = _me.Common.getUserFromXml(wmT(o.responseXML,"list").item(0))[0];
											_me.Friend.add(profile);//添加好友
											_me.CMD.renderMyFriend();
										});
									});
								}
								_me.CMD.getMsgInterval();//打开消息定时器
							});
						break;
					case 8://退出
						_me.Common.showAlert(msg.Content,"提示",
							function()
							{
								_me.CMD.destroyMainWindow();
							});
				}
			}
		},
		
		//视频邀请
		VidioReady:function()
		{
			
			callApp2(MyUserid);
		},
		VocieReady:function()//音频邀请
		{
			
			callApp2(MyUserid);
		},
		//发送消息
		sendMessage:function(uid)
		{
			var objContent = wm("wChatInputId"+uid+"Type1");
			var msg = "";
			if(wmF(objContent).trim()=="")
			{
				msg = "不能发送空消息!";
			}
			var users = [];
			users = _me.Friend;
			var userTo = _me.Common.getUserFromArr(uid,users);

			if(userTo&&userTo.IsBlocked)
			{
				msg = "您不能向被屏蔽好友发送消息。";
				Elem.Value(objContent);
			}
			if(msg!="")
			{
				_me.Common.showAlert(msg,"提示",function()
				{
					objContent.focus();
				});
				return;
			}
			var msg = new _me.Model.Msg(_me.Profile.UserID,uid,wmF(objContent).replace(/\n/img,"{br}").escapeHTML(),1,2);
			_webIM.CMD.showChatContent(uid,msg);
			_webIM.Data.sendMessage(msg);
			Elem.Value(objContent);
		},
		//闪屏振动
		sendFlashMsg:function(uid,o)
		{
			var msg = "";
			if(o.getAttribute("b")=="1")
			{
				msg = "您不能频繁地发送闪屏振动。";
			}
			var users = [];
			users = _me.Friend;
			var userTo = _me.Common.getUserFromArr(uid,users);
			if(userTo&&userTo.OnlineStatus==3)
			{
				msg = "您的联系人处于脱机状态，因此您不能发送闪屏振动。";
			}
			if(userTo&&userTo.IsBlocked)
			{
				msg = "您不能向被屏蔽好友发送闪屏振动。";
			}
			if(msg!="")
			{
				_me.Common.showAlert(msg,"提示");
				return;
			}
			o.setAttribute("b","1");
			var msg = new _me.Model.Msg(_me.Profile.UserID,uid,"FLASH",2,2);
			_webIM.CMD.showChatContent(uid,msg);
			_webIM.Data.sendMessage(msg);
			setTimeout(function()
			{
				o.setAttribute("b","0");
			},10000);
		},
		//flash加载完成
		sendFlashloadokMsg:function(uid)
		{
			//alert(uid);
			var msg = "";
			
			var users = [];
			users = _me.Friend;
			var userTo = _me.Common.getUserFromArr(uid,users);
			
			if(msg!="")
			{
				_me.Common.showAlert(msg,"提示");
				return;
			}
			
			var msg = new _me.Model.Msg(_me.Profile.UserID,uid,"FLASHOK",2,2);
			//_webIM.CMD.showChatContent(uid,msg);
			_webIM.Data.sendMessage(msg);
			
		},
		//视频邀请
		sendVidioMsg:function(uid,o,t)
		{			
			
			var msg = "";
			if(o.getAttribute("b")=="1")
			{
				msg = "您不能频繁地发视频邀请。";
			}
			var users = [];
			users = _me.Friend;
			var userTo = _me.Common.getUserFromArr(uid,users);
			if(userTo&&userTo.OnlineStatus==3)
			{
				msg = "您的联系人处于脱机状态，因此您不能发送视频邀请。";
			}
			if(userTo&&userTo.IsBlocked)
			{
				msg = "您不能向被屏蔽好友发送视频邀请。";
			}
			strReason='';
			switch(aWebimSwf.available()){
			case 'talking':
				strReason='您正在进行通话';
			break;
			}
			if(strReason!=""){
				msg='无法邀请对方进行视频。原因：'+strReason;
			}
			if(msg!="")
			{
				_me.Common.showAlert(msg,"提示");
				return;
			}
			o.setAttribute("b","1");
			var msg = new _me.Model.Msg(_me.Profile.UserID,uid,"VIDEO#invite#"+aWebimSwf.urlBase+_me.Profile.UserID,2,2);
			_webIM.CMD.showChatContent(uid,msg);
			_webIM.Data.sendMessage(msg);
			setTimeout(function()
			{
				o.setAttribute("b","0");
			},10000);
		},
		//音频邀请
		sendVocieMsg:function(uid,o,t)
		{
			
			var msg = "";
			if(o.getAttribute("b")=="1")
			{
				msg = "您不能频繁地发音频邀请。";
			}
			var users = [];
			users = _me.Friend;
			var userTo = _me.Common.getUserFromArr(uid,users);
			if(userTo&&userTo.OnlineStatus==3)
			{
				msg = "您的联系人处于脱机状态，因此您不能发送音频邀请。";
			}
			if(userTo&&userTo.IsBlocked)
			{
				msg = "您不能向被屏蔽好友发送音频邀请。";
			}
			strReason='';
			switch(aWebimSwf.available()){
			case 'talking':
				strReason='您正在进行通话';
			break;
			}
			if(strReason!=""){
				msg='无法邀请对方进行音频聊天。原因：'+strReason;
			}
			if(msg!="")
			{
				_me.Common.showAlert(msg,"提示");
				return;
			}
			o.setAttribute("b","1");
			var msg = new _me.Model.Msg(_me.Profile.UserID,uid,"AUDIO#invite#"+aWebimSwf.urlBase+_me.Profile.UserID,2,2);
			_webIM.CMD.showChatContent(uid,msg);
			_webIM.Data.sendMessage(msg);
			setTimeout(function()
			{
				o.setAttribute("b","0");
			},10000);
		},
		// 挂断
		sendStopMsg:function(uid,o,t)
		{
			var type=aWebimSwf.type;
			if(type != 'undefined' ){
				var msg = new _me.Model.Msg(_me.Profile.UserID,uid,type+"#stop",2,2);
				_webIM.CMD.showChatContent(uid,msg);
				_webIM.Data.sendMessage(msg);
			}
		},
		//显示表情列表
		showFaceList:function(id,e)
		{
			Elem.Show("divFaceList");
			var wChat = WinManage.GetWindow(id,1);
			var os = wm("divFaceList").style;
			os.top = (wChat.win.Top+wChat.win.Height-280-parseInt(wm("wChatInputId"+id+"Type1").style.height))+"px";
			os.left = (wChat.win.Left+9)+"px";
			os.width = "305px";
			os.height = "216px";
			document.onmousedown = function(e)
			{
				var ex = Evt.Left(e);
				var ey = Evt.Top(e);
				if(!(ex>parseInt(os.left)&&ex<parseInt(os.left)+parseInt(os.width)+2&&ey>parseInt(os.top)&&ey<parseInt(os.top)+parseInt(os.height)+2))
				{
					Elem.Hid("divFaceList");
					document.onmousedown = null;
				}
			};
		},
		//显示上传
		showUploadForm:function(type,id,e)
		{
			Elem.Show("divUploadForm");
			var wChat = WinManage.GetWindow(id,1);
			var os = wm("divUploadForm").style;
			os.top = (wChat.win.Top+wChat.win.Height-180-parseInt(wm("wChatInputId"+id+"Type1").style.height))+"px";
			os.left = (wChat.win.Left+9)+"px";
			os.width = "300px";
			os.height = "100px";
			var oFrame = wm("frameUploadForm");
			oFrame.src=localip + "page/uploadform.php?type="+type+"&uid="+id;
			document.onmousedown = function(e)
			{
				var ex = Evt.Left(e);
				var ey = Evt.Top(e);
				if(!(ex>parseInt(os.left)&&ex<parseInt(os.left)+parseInt(os.width)+2&&ey>parseInt(os.top)&&ey<parseInt(os.top)+parseInt(os.height)+2))
				{
					Elem.Hid("divUploadForm");
					document.onmousedown = null;
				}
			};
		},
		//上传结果
		uploadResult:function(type,uid,result,error,filepath,filename){
			webim_log('type='+type+' uid='+uid+' uploadImgResult:'+result+' error:'+error+' filepath:'+filepath+' filename='+filename);
			Elem.Hid('divUploadForm');
			if(result == '0'){
				var strMsg = "";
				if("img" == type ){
					strMsg = "<img src='"+localip + filepath+"' />";
				}else if ("file" == type){
					strMsg = "<a target='blank' href='"+localip+filepath+"' onclick='if(typeof(_OS) == \"object\") {_OS.downloadFile(\""+localip+filepath+"\",\""+filename+"\");return false;}'>"+filename+"</a>";
				}
				if("" != strMsg){
					var msg = new _me.Model.Msg(_me.Profile.UserID,uid,strMsg,1,2);
					_webIM.CMD.showChatContent(uid,msg);
					_webIM.Data.sendMessage(msg);
				}
			}else{
				_me.Common.showAlert('发送失败，错误：'+error,'发送失败');
			}
		},
		//打开和uid的聊天窗口
		openChatWindow:function(uid,isfocus)
		{			
			var winChat = WinManage.GetWindow(uid,1);
			var wWin = _me.Win;
			
			if(winChat)//窗口已存在
			{
				if(isfocus)
				{
					if(winChat.isMin)winChat.win.Minimize();//如果窗口处于最小化状态则还原
					winChat.win.Focus();//激活
				}
			}
			else//窗口不存在就创建,先找到对方的资料
			{
					//好友里面找
				var u = _me.Common.getUserFromArr(uid,_me.Friend);
				if(!u){
					//没有?再在陌生人里面找
					u = _me.Common.getUserFromArr(uid,_me.Custom);
				}
				if(!u){
					//还没有?再去数据库找...
					_me.Data.getCustomUserInfo(uid,
						function(o)
						{
							if(!o)return;
							if(!wmT(o.responseXML,"list"))return;
							var profile = _me.Common.getCostumFromXml(wmT(o.responseXML,"list").item(0))[0];
							if(!_me.Common.getCustomFromArr(uid,_me.Custom))//当前列表中不存在则添加
							{
								_me.Custom.add(profile);
							}
							//数据准备好了.这次一定行
							u = _me.Common.getUserFromArr(uid,_me.Custom);
							//创建窗口
							w = _webIM.CMD.OpenNewChatWindow(uid,u);
							w.Show();
							w.Focus();
							return;
						}
					);
				}
				if(!u){
					return ;
				}
				//创建窗口
				w = _webIM.CMD.OpenNewChatWindow(uid,u);
				w.Show();
				w.Focus();
				
				if(typeof(getIdentity)=='function'){
					getIdentity(_me.Profile.UserID,uid);
				}
			}
		},
		
		OpenNewChatWindow:function(uid,u)
		{
			var wWin = _me.Win;
			var w = new WebForm();
			w.Title = u.CustomName;
			w.Icon = "im/icon.png";
			w.Type = 1;
			w.UserID = uid;
			w.Height = 490;
			w.Width = 490;
			w.MinWidth = 400;
			w.MinHeight = 400;

			var lastChatWin = WinManage.GetLastWindow(1);
			
			if(!lastChatWin)
			{
				w.Left = wWin.win.Left<425?wWin.win.Left+wWin.win.Width+2:wWin.win.Left-422;
				w.Top = wWin.win.Top;
			}
			else
			{
				w.Left = lastChatWin.win.Left+15;
				w.Top = lastChatWin.win.Top+15;
			};
			w.ClosingCallback = function()//关闭前回调
			{					
				w.closewindow_js();
				
				return true;
			};
			w.closewindow_js = function()
			{
				if("undefined" != aWebimSwf.type){
					aWebimSwf.stop();
					aWebimSwf.close();
				}
			};
			w.RepaintMethod = function(w,h,id,t)
				{
					
					wm("wChatMainId"+id+"Type"+t).style.height = (h-70)+"px";
					wm("wChatSideId"+id+"Type"+t).style.height = (h-70)+"px";
					wm("wChatSideBarId"+id+"Type"+t).style.height = (h-70)+"px";
					_me.Config.ChatSide==1?Elem.Show(wm("wChatSideId"+id+"Type"+t)):Elem.Hid(wm("wChatSideId"+id+"Type"+t));
					wm("wChatMainId"+id+"Type"+t).style.width = _me.Config.ChatSide==1?(w-152)+"px":(w-10)+"px";//
					wm("wChatResizeBarId"+id+"Type"+t).style.width = _me.Config.ChatSide==1?(w-152)+"px":(w-10)+"px";//
					wm("wChatInputId"+id+"Type"+t).style.width = _me.Config.ChatSide==1?(w-167)+"px":(w-17)+"px";
					wm("wChatSignHolderId"+id+"Type"+t).style.width = (w-60)+"px";
					var viewHeight = (h-parseInt(wm("wChatInputId"+id+"Type"+t).style.height)-141);
					if(viewHeight<10)
					{
						wm("wChatInputId"+id+"Type"+t).style.height = (h-parseInt(wm("wChatViewId"+id+"Type"+t).style.height)-141)+"px";
					}
					else
					{
						wm("wChatViewId"+id+"Type"+t).style.height = viewHeight+"px";
					}
				};
			w.LoadedCallback = function(id,t)
				{
					wmT("wChatButtonBlockId"+id+"Type"+t,"img")[0].src = u.IsBlocked?localip+"images/im/chatbuttoncancelblock.png":localip+"images/im/chatbuttonblock.png";
					wmT("wChatButtonBlockId"+id+"Type"+t,"img")[0].title = u.IsBlocked?"取消阻止此联系人":"阻止此联系人";
					wm("wChatButtonBlockId"+id+"Type"+t).setAttribute("b",u.IsBlocked?"1":"2");
					wm("wChatSignId"+id+"Type"+t).innerHTML = u.UserSign+" &lt;"+u.UserEmail+">";
					
					var sideBtn = wmT("wChatSideBarId"+id+"Type"+t,"img")[0];
					sideBtn.src=_me.Config.ChatSide==1?localip+"images/im/chatsidebutton.png":localip+"images/im/chatsidebutton1.png";
					sideBtn.title = _me.Config.ChatSide==1?"隐藏参与者的显示图片":"显示参与者的显示图片";
					sideBtn.onclick = function()
					{
						_me.Config.ChatSide=_me.Config.ChatSide==1?2:1;
						w.RepaintMethod(w.Width,w.Height-24,w.UserID,w.Type);
						this.src=_me.Config.ChatSide==1?localip+"images/im/chatsidebutton.png":localip+"images/im/chatsidebutton1.png";
						this.title = _me.Config.ChatSide==1?"隐藏参与者的显示图片":"显示参与者的显示图片";
					};
					wm("wChatButtonBlockId"+id+"Type"+t).onclick = function()
					{
						var isblock = 3-parseInt(this.getAttribute("b"));
						_me.CMD.blockFriend(id,isblock);
					};
					wm("wChatButtonHistoryId"+id+"Type"+t).onclick = function()
					{
						_me.CMD.showMsgHistory(id);
					};
					wm("wChatFaceButtonSendImgId"+id+"Type"+t).onclick = function(e)
					{
						_me.CMD.showUploadForm('img',id,e);
					};
					wm("wChatFaceButtonSendFileId"+id+"Type"+t).onclick = function(e)
					{
						_me.CMD.showUploadForm('file',id,e);
					};
					wm("wChatResizeId"+id+"Type"+t).onmousedown = function()
					{
						var resizeBar = wm("wChatResizeBarId"+id+"Type"+t);
						var rs = resizeBar.style;
						rs.top = (90+parseInt(wm("wChatViewId"+id+"Type"+t).style.height))+"px";
						Elem.Show(resizeBar);
						document.onmousemove = function(e)
						{
							var _top = parseInt(rs.top)+(Evt.Top(e)-(parseInt(rs.top)+w.Top+5));
							_top = _top<140?140:_top;
							_top = _top>w.Height-100?w.Height-100:_top;
							rs.top = _top+"px";
						};
						document.onmouseup = function(e)
						{

							wm("wChatViewId"+id+"Type"+t).style.height = (parseInt(rs.top)-90)+"px";
							wm("wChatInputId"+id+"Type"+t).style.height = (w.Height-parseInt(rs.top)-75)+"px";
							document.onmousemove = document.onmouseup = null;
							Elem.Hid(resizeBar);
						};
					};
					wm("wChatInputId"+id+"Type"+t).onkeydown = function(e)
					{
						var e = e||event;
						if(e.keyCode==13)//回车
						{
							if(_me.Config.MsgSendKey==1)//enter发送
							{
								if(!e.ctrlKey&&!e.shiftKey)//没有同时按下了ctrl则发送消息
								{
									_me.CMD.sendMessage(id);
									return false;
								}
							}
							else//ctrl+enter发送
							{
								if(e.ctrlKey)//同时按下了ctrl则发送消息
								{
									_me.CMD.sendMessage(id);
									return false;
								}
							}
						}
						if(_me.Config.MsgSendKey==1&&(!e.ctrlKey && e.keyCode==13))
						{
						}
						else if(_me.Config.MsgSendKey==2&&(e.ctrlKey && e.keyCode==13))
						{
							_me.CMD.sendMessage(id);
							return false;
						}
					};
					wm("wChatBtnSendId"+id+"Type"+t).onclick = function()
					{
						_me.CMD.sendMessage(id);
					};
					wm("wChatFaceButtonFlashId"+id+"Type"+t).onclick = function()//闪屏发送
					{
						_me.CMD.sendFlashMsg(id,this);
						
					};
					wm("wChatButtonVidioId"+id+"Type"+t).onclick =function()//请求视频
					{
						if(typeof(goVideo)=='function' && !goVideo()){
							return;
						}
						ttt = "ready";
						_me.CMD.sendVidioMsg(id,this,t);
					};
					wm("wChatButtonVioceId"+id+"Type"+t).onclick = function()//请求音频
					{		
						if(typeof(goVideo)=='function' && !goVideo()){
							return;
						}
						vvv = "ready";
						_me.CMD.sendVocieMsg(id,this,t);
					};
					wm("wChatButtonStopId"+id+"Type"+t).onclick = function()//挂断
					{
						_me.CMD.sendStopMsg(id,this,t);
					};
					wm("wChatFaceButtonFaceId"+id+"Type"+t).onclick = function(e)
					{
						_me.CMD.showFaceList(id,e);
					};
					wm("wChatBtnOptionId"+id+"Type"+t).onclick = function(e)
					{
						var m = new SysMenu("menuMsgSendKey"+id+"Type"+t);
						m.Data = ["哦|Elem.Value('wChatInputId"+id+"Type"+t+"','哦');_webIM.CMD.sendMessage("+id+")",
								"好吧|Elem.Value('wChatInputId"+id+"Type"+t+"','好吧');_webIM.CMD.sendMessage("+id+")",
								"我得下了，拜拜!|Elem.Value('wChatInputId"+id+"Type"+t+"','我得下了，拜拜!');_webIM.CMD.sendMessage("+id+")",
								"",
								"按Enter 键发送消息|_webIM.Config.MsgSendKey=1",
								"按Ctrl+Enter 键发送消息|_webIM.Config.MsgSendKey=2"];
						m.Data[_me.Config.MsgSendKey+3]+="|"+localip+"images/selected.gif|"+localip+"images/selectedhover.gif";
						m.E = e;
						m.HasIcon = true;
						m.Width = 175;
						m.Show();
					};
							wm("wChatFaceFriendId"+id+"Type"+t).src = localip+"userface/"+u.UserFace;
							wm("wChatFaceMeId"+id+"Type"+t).src = localip+"userface/"+_me.Profile.UserFace;
							wm("wChatInputId"+id+"Type"+t).focus();
				};
			return w;
		}
	};
	//初始化
	this.Initialize = function()
	{
		if(!Other.TestCookie())
		{
			alert("注意：您的浏览器不支持Cookie，部分功能将无法使用!");
		}
		_me.CMD.intLoginWindow();
		_me.Sys = new _me.Model.Sys();
	};
}
