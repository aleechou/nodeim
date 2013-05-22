
// kate shell 加载完成事件
function onKateLoaded()
{
	// 按钮事件
	$("#btnOpenConsole").click(function(){
		kateapi.inspector(kateapi.wndId) ;
	}) ;


	$("#btnCallParentWindow").click(function(){
		var value = $("[name=num]").val() ;
		kate.parentWindow.call("fromChildWindow",[value]) ;
	}) ;


}

function getValue()
{
	return $("[name=num]").val() ;
}