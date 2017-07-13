var common={

	//打印json字符串(封装console.log方法)
	log : function( tag, params ) {
		var _tag = '',
			_params = null;
			
		if( arguments.length == 1 ) {
			_tag = 'params';
			_params = tag;
		} else if( arguments.length == 2 ) {
			_tag = tag;
			_params = params;
		}
		
		console.log(  _tag + ':' + ( ( typeof _params == 'object' || typeof _params == 'array' ) ? JSON.stringify( _params ) : _params ) );
		
	},	

	//从url上获取?后的参数，返回一个对象
	getURL : function() {
		var urlStr = window.location.search, //得到的是url中？后部分
			urlArr = [],
			urlObj = {},
			paramsArr = [],
			posQ = urlStr.indexOf( '?' );//返回问号出现位置的索引
		
		if ( posQ != -1 && posQ == 0 ) {
			urlStr = urlStr.slice( posQ + 1, urlStr.length );//截取到问号后的字符串；
		}
		
		urlArr = urlStr.split( '&' ); //有&的地方分割，变成数组
		
		if ( urlArr.length != 0 ) {
			for( var i = 0; i < urlArr.length; i++ ){
				paramsArr = urlArr[i].split( '=' );//有=的地方分割，变成新数组
				urlObj[ paramsArr[0] ] = paramsArr[1];
			}
		} else {
			paramsArr = urlStr.split( '=' );
			urlObj[ paramsArr[0] ] = paramsArr[1];
		}
		
		//console.log( 'urlObject:' + JSON.stringify(urlObj) );
		
		return urlObj;
	},
	
	/*获取url上各部分参数的通用方法
	 	使用方法：var myUrl=parseURL(url);
	 	myUrl.file/myUrl.host/myUrl.params/myUrl.query
	 */
	parseURL: function(url) {
	    var a =  document.createElement('a');
	    a.href = url;
	    return {
	        source: url,
	        protocol: a.protocol.replace(':',''),
	        host: a.hostname,
	        port: a.port,
	        query: a.search,
	        params: (function(){
	            var ret = {},
	                seg = a.search.replace(/^\?/,'').split('&'),
	                len = seg.length, i = 0, s;
	            for (i;i<len;i++) {
	                if (!seg[i]) { continue; }
	                s = seg[i].split('=');
	                ret[s[0]] = s[1];
	            }
	            return ret;
	        })(),
	        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	        hash: a.hash.replace('#',''),
	        path: a.pathname.replace(/^([^\/])/,'/$1'),
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	        segments: a.pathname.replace(/^\//,'').split('/')
	    };
	},
	
	//获取当天的时间
	todayDate : function( ) {
		var _todayDate = new Date( );
		//先在月份和号前加00然后取倒数两位；
		return _todayDate.getFullYear( ) + '-' + ( '00' + ( _todayDate.getMonth( ) + 1 ) ).slice(-2) + '-' + ( '00' + _todayDate.getDate( ) ).slice( -2 ); 
	},

	//比较两个时间段的前后
	compareWithDate : function( firstDate, secondDate ) {
		var _firstDateObj = ( typeof firstDate == 'string' ) ? new Date( firstDate ) : firstDate,
			_secondDateObj = ( typeof secondDate == 'string' ) ? new Date( secondDate ) : secondDate;
			
		return _firstDateObj.getTime( ) >= _secondDateObj.getTime( );
	},

	//计算此月的最后一天
	endDayOfMonth : function( selectedMonth ) {
		console.log( 'selectedMonth:' + selectedMonth);
		var _todayDate = new Date( ),
			_curDate = new Date( selectedMonth + '-01' ),
			_curYear = _curDate.getFullYear( ),
			_curMonth = _curDate.getMonth( ) + 1,
			_endDay = new Date( _curYear, _curMonth, 0 );
			
		if( _todayDate.getFullYear( ) == _curYear &&  _todayDate.getMonth( ) + 1 == _curMonth ) {
			return sys.todayDate( );
		}
		
		return selectedMonth + '-' + _endDay.getDate( );
	},

	//计算给定日期前后的n天的日期(type='before' / 'after')
	dateDiffDay : function( currentDate , num, type ){
	    var _s, _d, _time, _time2,
	    	_dateObj = typeof currentDate == 'string' ? new Date( currentDate ) : currentDate,
	    	_selectNum = num ? num : 4,
	    	_curType = type ? type : 'before';
	    	
	    _time = _dateObj.getTime();
	    _time2 = _selectNum * 1000 * 3600 * 24;
	    
	    if ( _curType == 'before' ) {
	   		_time -= _time2; 	
	    } else {
	    	_time += _time2;
	    }
	   
	    _d = new Date( _time );
	    _s = _d.getFullYear() + '-';
	    _s += ( '00' + ( _d.getMonth() + 1 ) ).slice(-2) + '-';
	    _s += ( '00' + _d.getDate() ).slice(-2);
	    
	    return _s;
	},

	//计算给定日期前后的n月的日期,
	dateDiffMonth : function( selectedDate, num, type ){
	    var _s = '',
	    	_curMonth = 0,
	    	_curYear = 0,
	    	_diffYearValue = 0,
	    	_diffMonthValue = 0,
	    	_selectNum = num ? num : 4,
	    	_curType = type ? type : 'before',
	    	_selectedDateObj =  typeof selectedDate == 'string' ? new Date( selectedDate ) : selectedDate;
	    	
	   	_curYear = _selectedDateObj.getFullYear();
	    _curMonth = _selectedDateObj.getMonth() + 1;
	    _diffYearValue = _curYear;
	    if ( _curType == 'before' ) {
	    	_diffMonthValue = Math.abs( _curMonth - _selectNum );
		    if ( _curMonth <= _selectNum ) {
		   		_diffMonthValue = 12 - _diffMonthValue;
		   		_diffYearValue -= 1;
		    }
	    } else {
	    	_diffMonthValue = Math.abs( _curMonth + _selectNum );
		    if ( _diffMonthValue > 12 ) {
		   		_diffMonthValue = _diffMonthValue - 12;
		   		_diffYearValue += 1;
		    }
	    }
	    	
	    _s = _diffYearValue + '-';
	    _s += ( '00' + ( _diffMonthValue ) ).slice(-2);
	    
	    return _s;
	},
	
	//按日来变化
	dateRangeByDay : function( currentDate, num, type ) {
		var _currentDate = currentDate ? currentDate : sys.todayDate(),
			_defDate = sys.dateDiffDay( _currentDate, num, type );
		
		return ( !type || type == 'before' ) ?  ( _defDate + '—' + _currentDate ) : ( _currentDate + '—' + _defDate );
	},
	
	//按月份来变化
	dateRangeByMonth : function( currentDate, num, type ) {
		var _currentDate = currentDate ? currentDate : sys.todayDate(),
			_defDate = sys.dateDiffMonth( _currentDate, num, type );
		
		return ( !type || type == 'before' ) ?  ( _defDate + '—' + _currentDate.slice( 0, 7 ) ) : ( _currentDate.slice( 0, 7 ) + '—' + _defDate );
	},
	
	//按年份来变化
	dateRangeByYear : function( currentDate ) {
		var _currentDate = currentDate ?  currentDate : sys.todayDate(),
			_currentDate = typeof _currentDate == 'string' ? new Date( _currentDate ) : _currentDate,
			_currentYear = _currentDate.getFullYear( ),
			_currentMonth = _currentDate.getMonth( ),
			_currentMonthStr = ( '00' + ( _currentMonth + 1 ) ).slice( -2 ),
			_currentDateStr = _currentYear + '-' + _currentMonthStr,
			_beforeDateStr = ( _currentYear - 1 ) + '-' + _currentMonthStr;
		
		return _beforeDateStr + '—' + _currentDateStr;
	},
	
	//把日期分开为起始日期和结束日期
	splitDateRange : function( rangeDateStr ) {
		if( rangeDateStr.indexOf( '—' ) < 0 ) {
			sys.log( 'error,there has not \'—\' in this word', rangeDateStr );
			return; 
		}
		
		var _rangeDateObj = rangeDateStr.split( '—' );
		
		return {
			firstValue : _rangeDateObj[0],
			secondValue : _rangeDateObj[1]
		}
	},
	
	//按拼音首字母排列
	chineseSort : function( arr,empty ) {
		
	    if( !String.prototype.localeCompare ) {
	    	return null;
	    }
	     
	    var letters = "#ABCDEFGHJKLMNOPQRSTWXYZ".split(''); //abcdefghjklmnopqrstwxyz#
	    var yw = "ABCDEFGHJKLMNOPQRSTUVWXYZ".split('');
	    var zh = "吖八攃哒妸发旮哈讥咔垃痳拏噢妑七冄仨它穵夕丫帀".split('');
	     	    //吖八攃哒妸发旮哈讥咔垃痳拏噢妑七冄仨它穵夕丫帀
	    var segs = [];
	    var curr;
	    for( var i = 0; i < letters.length; i++ ){
	    	curr = {letter: letters[i], data:[]};
	    	for( var j = 0; j < arr.length; j++ ) {
	    		if ((!zh[i-1] || zh[i-1].localeCompare(arr[j]) <= 0) && arr[j].localeCompare(zh[i]) == -1 ){
                	curr.data.push(arr[j]);
           	 	}
           	 	
	    	}
	        console.log(curr);//26个字母排序来对号入座
	        if(empty || curr.data.length) {
	        	//筛选出的data不是空数组的时候就拿出来重新按首字母排列
	            segs.push(curr);
	            curr.data.sort(function(a,b){
	                return a.localeCompare( b );
	            });
	        }
	    }
	    console.log(segs);
	    return segs;//[{data:['北京'],letter: 'B'},{data: ['佛山'],letter: 'F'}]
	},

	/*获取当前设备的版本型号*/
	versions: function(){
		var u = window.navigator.userAgent;
		var num ;
		if(u.indexOf('Trident') > -1){
			//IE
			return "IE";
		}else if(u.indexOf('Presto') > -1){
			//opera
			return "Opera";
		}else if(u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1){
			//firefox
			return "Firefox";
		}else if(u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1){
			//苹果、谷歌内核
			if(u.indexOf('Chrome') > -1){
				//chrome	
				return "Chrome";
			}else if(u.indexOf('OPR')){
				//webkit Opera
				return "Opera_webkit"
			}else{
				//Safari
				return "Safari";
			}
		}else if(u.indexOf('Mobile') > -1){
			//移动端
			if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
				//ios
					if(u.indexOf('iPhone') > -1){
						//iphone
						return "iPhone"	
					}else if(u.indexOf('iPod') > -1){
						//ipod	
						return "iPod"
					}else if(u.indexOf('iPad') > -1){
						//ipad
						return "iPad"
					}
			}else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
				//android
				num = u.substr(u.indexOf('Android') + 8, 3);
				return {"type":"Android", "version": num};//返回安卓的版本号
			}else if(u.indexOf('BB10') > -1 ){
				//黑莓bb10系统
				return "BB10";
			}else if(u.indexOf('IEMobile')){
				//windows phone
				return "Windows Phone"
			}
		}
	},

	//显示等待框

	/*样式
		#loadingBox,#alertBox{
			width:100%;
			height: 100%;
			position:fixed;
			background: rgba(169,169,169,.3);
			z-index: 10086;
			text-align: center;
			display: -webkit-flex;
			display:-webkit-box;
			display: flex;
			top: 0px;
			left: 0;	
		    -webkit-box-pack: center;
		    -webkit-justify-content: center;
		    justify-content: center;   
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    align-items: center;
		}
		#alertBox p{
			padding: 0 5px;
			height: 30px;
			line-height: 30px;
			border-radius: 5px;
			font-size: 12px;
			color: #fff;
			background: rgba(0,0,0,.3);
		}	
	*/


	load: function(flag){
		if(flag=='load'){
			var loadbox= '<div id="loadingBox"><div>请稍候...</div></div>';
			if($('#loadingBox').length>0){
				$('#loadingBox').show();
			}else{
				$('html,body').append($('#loadingBox'));
			}
		}else if(flag=='close'){
			$('#loadingBox').hide();
		}
	},

	//toast 显示提示框自动消失
	toast: function(){
		var alertbox= '<div id="alertBox"><p>请稍候...</p></div>';
		if($('#alertBox').length>0){
			$('#alertBox').show();
		}else{
			$('body').append(alertbox);
		};

		setTimeout(function(){
			$('#alertBox').hide();
		},1000)
	},
	overlay: function(){
		$("#TB_overlayBG").css({
			display:"block",height:$(document).height()
		});
	},
	showMsg: function(msg){
		var msghtml = '<div class="msgShow">'+msg+'</div>';
		$('body').append(msghtml);
		$('.msgShow').fadeIn(300);
		setTimeout(function(){
			$('.msgShow').fadeOut(300,function(){
				$('.msgShow').remove();
			})
		},2000);
	},
	
	/*弹框出来后禁止底层滚动*/
		/*.disScroll{
			overflow-y: hidden;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
		}

	*/
	contact: function (barrage,bottom){		
			common.overlay();
			y=document.body.scrollTop;
			console.log(y);
			$(bottom).addClass('disScroll');			
			var winHeight = $(window).height();  
			var winWidth = $(window).width();   
			var contactHeight = $(barrage).height();
			var contactWidth = $(barrage).width();
			var topPx = winHeight/2-contactHeight/2;				
			var leftPx = winWidth/2 - contactWidth/2;
			$(barrage).css({
				left:leftPx +"px",
				top:topPx +"px",
				display:"block"
			});
			$('.btnClose').click(function(){
				$(barrage).fadeOut(200);
				$("#TB_overlayBG").css("display","none");
				$(bottom).removeClass('disScroll');
				document.body.scrollTop=y;
				console.log(y);
			})
		
	},

	//禁止右键点击
	rightOff: function(){
		$(document).bind("contextmenu",function(e){
	        return false;
	    });
	},

	
	//图片预加载

	/*调用方法
		preloadimages(['images/2.jpg','images/3.jpg','images/4.jpg']).done(function(images){
			for(var i=0;i<images.length;i++){
				var img=document.createElement('img');
				img.src=images[i].src;
				document.body.appendChild(img);
			}
		})
	*/
	preloadimages: function(arr){   
	    var newimages=[], loadedimages=0;
	    var postaction=function(){};  //此处增加了一个postaction函数
	    var arr=(typeof arr!="object")? [arr] : arr;

	    function imageloadpost(){
	        loadedimages++
	        if (loadedimages==arr.length){
	            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
	        }
	    }
	    for (var i=0; i<arr.length; i++){
	        newimages[i]=new Image()
	        newimages[i].src=arr[i]
	        newimages[i].onload=function(){
	            imageloadpost()
	        }
	        newimages[i].onerror=function(){
	            imageloadpost()
	        }
	    }
	    return { //此处返回一个空白对象的done方法
	        done:function(f){
	            postaction=f || postaction
	        }
	    }
	},

	/** 
	* 返回前一页（或关闭本页面） 
	* <li>如果没有前一页历史，则直接关闭当前页面</li> 
	*/
	 goBack: function(){ 
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
	},

	//rem 手机端自适应 rem(document,window)

	rem: function (doc, win) {
	    var docEl = doc.documentElement,
	        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	        recalc = function () {
	            var clientWidth = docEl.clientWidth;
	            if (!clientWidth) return;
	            if(clientWidth>=640){
	                docEl.style.fontSize = '100px';
	            }else{
	                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
	            }
	        };
	    if (!doc.addEventListener) return;
	    win.addEventListener(resizeEvt, recalc, false);
	    doc.addEventListener('DOMContentLoaded', recalc, false);
	},


	//让显示隐藏(来回切换不同效果)
	showHide: function(ele){
		var flag=true;
		if(flag){
			$(ele).hide();
			//$(ele).removeClass('');
		}else{
			$(ele).show();
			//$(ele).addClass('');
		}

		flag=!flag;
	},

	//16进制随机颜色函数
	randomColor: function(){
		var colorRange = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
     	    
	    return '#' +colorRange[Math.floor(Math.random() * 16)] +
	               colorRange[Math.floor(Math.random() * 16)] +
	               colorRange[Math.floor(Math.random() * 16)] +
	               colorRange[Math.floor(Math.random() * 16)] +
	               colorRange[Math.floor(Math.random() * 16)] +
	               colorRange[Math.floor(Math.random() * 16)];
	   
	},
	//16进制随机颜色 Number.toString()函数返回表示该数字的指定进制形式的字符串。
	getRandomColor: function() {
		var rgb = []
		for (var i = 0 ; i < 3; ++i){
		    var color = Math.floor(Math.random() * 256).toString(16)
		    color = color.length == 1 ? '0' + color : color
		    rgb.push(color)
		}
		return '#' + rgb.join('')
	},

	//搜索框关键字搜索
	searchTips: function(search,container,_html,newhtml,callback){
		if ( $(search)[0].value === '' &&  dataList.length !== 0 ){
			$(container).html(_html);	
			if ( typeof callback == 'function' ) callback();
		} ;
		//搜索框搜索目的收件人
		$(search)[0].onkeyup=function(){
			$(container).html('');							
			if ( $(search)[0].value === '' &&  dataList.length !== 0 ){
				$(container).html(_html);								
				if ( typeof callback == 'function' ) callback();
			} else {									
				var _hasSortData = '',
					_divStr = '',
					_curr = {},
					_tempData = null,
					_result = [];
					
				if ( dataList.length !== 0 ) {
					for( var i = 0; i < dataList.length; i++ ){
						_tempData = dataList[i];
						
						if( _tempData.receiver.indexOf( $(search)[0].value ) != -1 ) {
							_curr=	_tempData;								
							_result.push( _curr );
							console.log(_result );
						}
					}
					
					if ( _result.length !== 0 ) {
						$.each(_result,function(index,item){
							_divStr +=newhtml;
							
						});
						$(container).html(_divStr);
						if ( typeof callback == 'function' ) callback();
						
					} else {
						//alert( '没有此收件人记录' );
						$(container).html(_html);
						if ( typeof callback == 'function' ) callback();
					}
					
				}
			
			}							
		}
		
		//搜索框事件结束

	},

	//转义符拼接字符串
	stringMap: function(string){
		var entityMap = {
	        "&": "&amp;",
	        "<": "&lt;",
	        ">": "&gt;",
	        '"': '&quot;',
	        "'": '&#39;',
	        "/": '&#x2F;'
	    };
	    return String(string).replace(/[&<>"'\/]/g, function (s) {
	        return entityMap[s];
	    });

	},
	
	//window.onload
	
	addLoadEvent: function(func){
		var old_onload=window.onload;
		if(typeof window.onload!='function'){
			window.onload=func;
		}else{
			window.onload=function(){
				old_onload();
				func();
			}
		}
	},

	//rem换算手机端 使用方法：remResize(document, window);
	remResize: function (doc, win) {
	    var docEl = doc.documentElement,
	        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	        recalc = function () {
	            var clientWidth = docEl.clientWidth;
	            if (!clientWidth) return;
	            if(clientWidth>=640){
	                docEl.style.fontSize = '100px';
	            }else{
	                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
	            }
	        };
	    if (!doc.addEventListener) return;
	    win.addEventListener(resizeEvt, recalc, false);
	    doc.addEventListener('DOMContentLoaded', recalc, false);
	}


};

//优化alert，confirm弹出框
var win = new function () {
    // 确认框和提示框宽度
    this.width = 220;

    // 确认框和提示框高度
    this.height = 140;

    // 手动关闭窗体
    this.close = function () {
        $('.win iframe').remove();
        $('.win').remove();
    };

    // 打开窗体
    this.open = function (width, height, title, url, closed) {
        this._close = function () {
            this.close();
            if ($.isFunction(closed)) closed();
        };

        var html = '<div class="win"><div class="mask-layer"></div>'
        +'<div class="window-panel"><iframe class="title-panel" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>'
        +'<h3 class="title"></h3><a href="javascript:void(0)" onclick="win._close();" class="close-btn" title="关闭">×</a>'
        +'<iframe class="body-panel" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto" src=""></iframe></div></div>';
        var jq = $(html);
        jq.find(".window-panel").height(height).width(width).css("margin-left", -width / 2).css("margin-top", -height / 2);
        jq.find(".title").html(title);
        jq.find(".body-panel").height(height - 36).attr("src", url);
        jq.appendTo('body').fadeIn();
        $(".win .window-panel").focus();
    };

    // 显示消息框
    function messageBox(html, title, message) {
        win.close();
        var jq = $(html);

        jq.find(".window-panel").height(win.height).width(win.width).css("margin-left", -win.width / 2).css("margin-top", -win.height / 2);
        jq.find(".title-panel").height(win.height);
        jq.find(".title").html(title);
        jq.find(".body-panel").height(win.height - 36);
        jq.find(".content").html(message.replace('\r\n', '<br/>'));
        jq.appendTo('body').show();
        $(".win .w-btn:first").focus();
    }

    // 确认框
    this.confirm = function (title, message, callback) {
        this._close = function (r) {
            this.close();
            //判断是否为函数（返回true/false）
            if ($.isFunction(callback)) callback(r);
        };
      
        var html = '<div class="win"><div class="mask-layer"></div>'
        +'<div class="window-panel"><iframe class="title-panel" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>'
        +'<h3 class="title"></h3><a href="javascript:void(0)" onclick="win._close(false);" class="close-btn" title="关闭">×</a>'
        +'<div class="body-panel"><p class="content"></p><p class="btns"><button class="w-btn" tabindex="1" onclick="win._close(true);">确定</button>'
        +'<button class="w-btn" onclick="win._close(false);">取消</button></p></div></div></div>';
        messageBox(html, title, message);
    
    };

    // 提示框
    this.alert = function (title, message, closed) {
        this._close = function () {
            this.close();
            if ($.isFunction(closed)) closed();
        };
        
        var html = '<div class="win"><div class="mask-layer"></div>'
        +'<div class="window-panel"><iframe class="title-panel" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>'
        +'<h3 class="title"></h3><a href="javascript:void(0)" onclick="win._close();" class="close-btn" title="关闭">×</a>'
        +'<div class="body-panel"><p class="content"></p><p class="btns"><button class="w-btn" tabindex="1" onclick="win._close();">确定</button></p></div>'
        +'</div></div>';
        messageBox(html, title, message);
    }

    // 提示框
    this.alertEx = function (message) {
        this.alert('系统提示', message);
    }
};