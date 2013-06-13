// kate shell 加载完成事件
function onKateLoaded()
{
	// 不显示窗口边框 (必须在 window.show() 之前调用)
	//kate.window.setFlags( 0x00000800 ) ;	
	
	// 显示窗口 (默认是不显示窗口的)
	kate.window.resize( 800, 600 ) ;	
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
	
	// 屏幕截图快捷键
	window.onKateGlobalKeyEvent = function(keys){
		console.log("emit global keys: ",keys) ;
		if(keys.toLowerCase()=='ctrl+alt+a')
		{
			kate.shotScreen() ;
		}
	}
	// 注册快捷键
	kate.window.regGlobalKeyEvent("CTRL+ALT+A") ;
}

fromChildWindow = function(value)
{
	alert("子窗口传来的参数："+value) ;
}




$(function(){
	$(".contextMenuDemo").on('contextmenu',function(event){
    	console.log(event) ;

    	$("#menu")
    		.show()
    		.css("left",event.clientX)
    		.css("top",event.clientY) ;

        return false;
	}) ;

	// 关闭菜单
	$(document).on('click',function(event){
    	$("#menu").hide() ;
	}) ;

	$("#menu li").click(function(event){
		alert( $(event.target).text() ) ;
	}) ;
});




$(function(){
	$("#my-name-is-drag").draggable();
	$("#my-name-is-drop").droppable({
      drop: function( event, ui ) {
      	alert("收到！") ;
      }
  	});
}) ;

