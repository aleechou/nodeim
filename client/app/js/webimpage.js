var p = null;
window.onload = function()
{
    if(typeof(_littleOS) == 'undefined' ){
		if(!parent.WinManage.WindowsList||parent.WinManage.WindowsList.length<1)
		{
			//alert("非法调用");
			location.href = "#";
		}
		else
		{
			p = parent;
			if(uid)
			{
				var w = p.WinManage.GetWindow(uid,3);
				w.win.HideLoading();
				document.onclick = function()
				{
					w.win.Focus();
				};
			}
		}
	}else{
		if(uid)
		{
			_littleOS.evaluateJavaScript("var w = WinManage.GetWindow("+uid+",3);w.win.HideLoading();");
			document.onclick = function()
			{
				_littleOS.evaluateJavaScript("var w = WinManage.GetWindow("+uid+",3);w.win.Focus();");
			};
		}
		//_littleOS.evaluateJavaScript("alert('_littleOS.123')");
		//alert(_littleOS.evaluateJavaScript("document"));
		//p=_littleOS.evaluateJavaScript("document");
	}
	var inputs = wmT("input");
	for(var i=0;i<inputs.length;i++)
	{
		if(inputs[i].type=="text"||inputs[i].type=="password")
		{
			inputs[i].focus();
			break;
		}
	}
}
function winMax(id,t)
{
	//var w = p.WinManage.GetWindow(id,t);
	if(typeof(_littleOS) == 'undefined'){
		WinManage.GetWindow(id,t);
	}else{
		var w = _littleOS.evaluateJavaScript("WinManage.GetWindow(id,"+t+")");
		if(w&&w.isMin)w.win.Minimize();
	}
	
}
function winClose(evt)
{
	Evt.NoBubble(evt||event);
	if(!uid)return;
	if(typeof(_littleOS) == 'undefined'){
		var w=parent.WinManage.GetWindow(uid,3);
		w.win.Close();
	}else{
		_littleOS.evaluateJavaScript("var w = WinManage.GetWindow("+uid+",3);w.win.Close();")
	}
}
function showLoading()
{
	if(!uid)return;
	if(typeof(_littleOS) == 'undefined'){
		parent.WinManage.GetWindow(uid,3).win.ShowLoading();
	}else{
		_littleOS.evaluateJavaScript("WinManage.GetWindow("+uid+",3).win.ShowLoading()");
	}
}
