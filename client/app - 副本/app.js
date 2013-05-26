// kate shell 加载完成事件
function onKateLoaded()
{
	// 显示窗口 (默认是不显示窗口的)
	kate.window.show() ;

	var secondWindow ;

	// 按钮事件
	$("#btnOpenConsole").click(function(){
		kate.window.inspector() ;
	}) ;

	$("#btnOpenWindow").click(function(){
		secondWindow = kate.createWindow(kate.appFolder+'/dialog.html') ;
		secondWindow.show() ;
	}) ;

	$("#btnShotScreen").click(function(){
		kate.shotScreen() ;
	}) ;

	$("#btnRead").click(function(){
		if( !secondWindow )
		{
			alert("第二个窗口还没有打开") ;
			return ;
		}

		alert( secondWindow.call("getValue",[1,2,3]) ) ;
	}) ;
}

fromChildWindow = function(value)
{
	alert("子窗口传来的参数："+value) ;
}