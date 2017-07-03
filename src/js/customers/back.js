/** 
* 返回前一页（或关闭本页面） 
* <li>如果没有前一页历史，则直接关闭当前页面</li> 
*/
function goBack(){ 
	if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE 
		if(history.length > 0){ 
		window.history.go( -1 ); 
		}else{ 
		window.opener=null;window.close(); 
		} 
	}else{ //非IE浏览器 
		if (navigator.userAgent.indexOf('Firefox') >= 0 || 
		navigator.userAgent.indexOf('Opera') >= 0 || 
		navigator.userAgent.indexOf('Safari') >= 0 || 
		navigator.userAgent.indexOf('Chrome') >= 0 || 
		navigator.userAgent.indexOf('WebKit') >= 0){ 
		 
			if(window.history.length > 1){ 
			window.history.go( -1 ); 
			}else{ 
				window.opener=null;window.close(); 
			} 
		}else{ //未知的浏览器 
			window.history.go( -1 ); 
		} 
	} 
}