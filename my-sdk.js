/*
	這一支應該就是我們主要給外呼叫的sdk js檔
	目前設想這隻 sdk 會處理:
	1.吐商品資料
	2.收集吐出來的商品資料曝光率? <--- 好像由後端處理就好了吧
*/
(function(window, document){
	console.log('my-sdk is loaded.');
	var sdk = window.MySdk || (window.MySdk = []);  //使用區域變數去承接全域變數
	console.dir(sdk);
	
	 //外部的參數統一放在 陣列索引[0]
	var win = sdk[0].w, 
		doc = sdk[0].d,
		sid = sdk[0].p.sid,
		cid = sdk[0].p.cid;

	/*定義: 具相依性的js檔或套件的方法... 目前還不確定相依性是否有正確
		imports   其他要載入的js檔 (陣列型態, 要自行依相依性填入js檔)
		fn           所有js檔案都載入後的callback
	*/
    function module (imports, fn) {
        var maxIndex = imports.length - 1, //這一次要載入的所有js索引數量
            isloaded = 0,                  //要用來紀錄已經載入成功的索引數,判斷所有都已經載入完畢用
            sAry = [];                     //要用來紀錄所有新增script的物件用
        
		for (var k = 0; k <= maxIndex; k++) {
			var render = new Date().getTime(),
				s = document.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = imports[k] + '?r=' + render;
			sAry.push(s);

			if (sAry[isloaded].attachEvent) { // for ie
				sAry[k].attachEvent('onreadystatechange', function () {
					if (sAry[isloaded].readyState == 'complete') {
						isloaded++;
					}
				});
			} else { // for  firefox, chrome
				sAry[k].addEventListener('load', function () {
					isloaded++;
				}, false);
			}
		}
        //console.log(sAry);

        var InterVel = setInterval(function () {
            //console.log(isloaded +  ' / ' + maxIndex);
            if(isloaded <= maxIndex) {
                //console.log(isloaded);
                document.getElementsByTagName('head')[0].appendChild(sAry[isloaded]);
            }
            
            if(isloaded > maxIndex) {
                clearInterval(InterVel);
                fn();
            }
        }, 10);
    };

	//假設: 檢查tokenId是否已經註冊
	function checkToken() {
		return (sdk[0].p.token === 'CO2');  //練習用... 實際檢查方法還要問
	};
	
	//假設: 檢查url方法 (提醒不要用window.location)
	function checkUrl() {
		return (document.domain === doc.domain);  //練習用... 實際檢查方法還要問
	};
	
	//假設: 提供外部取得產品資料的方法
	sdk.getData = function () {
		return false;  //資料尚未取得前統一回false
	};
	
	//假設: 提供給外部自定義的callback方法
	if ( sdk.callback != null ) {
		sdk.callback = sdk.callback;
	} else {
		sdk.callback = function () {};
	}
	

	//假設: sdk 跟 server 拿商品資料的方法
	function loadPrd(_sid, _cid) {
        var render = new Date().getTime();
		aja()
			.data({'sid': _sid, 'cid': _cid})
			.url('data.json?r=' + render)
			.on('success', function (data) {
				sdk.catchData = data;

				//等待拿取資料後從新定義sdk.getData方法
				sdk.getData = function () {
					return sdk.catchData;
				};
				
				sdk.callback();
			})
			.go();
	};

	//整體初始化方法
	function init() {
		if (!checkToken()) {
			console.log('token錯誤');
			return false;
		} 
		
		if (!checkUrl()) {
			console.log('tUrl錯誤');
			return false;
		}
		
		loadPrd(sid, cid);  //這邊還要想要自動拿取資料嗎? 還是由外部決定呢?
	};

	//執行所有相依姓的套件都載入完成後執行初始化...
    module(['aja.min.js', 'a.js', 'b.js', 'c.js'], function() {
		console.log('All javascript is loaded.');
        init();
	});

})(window, document);