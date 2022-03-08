/** eyesmedia richmenu 套件 
 * author: lucas
 * 
 * dependent: window.Fetch
 * support browser: Chrome 42^, Firefox 39^, Safari 10.1^, 
 *                  Edge 14^, 
 * support device: iOS Safari 10.3^,  
 *                 Andorid Browser 67^
 * not support: All IE, Opera Mini
 * 
 * use example:
 * <script>
 *  (function() {
 *    RIM = window.RIM || (window.RIM = {});
 *    var s = document.createElement('script');
 *    s.type = 'text/javascript';
 *    s.src ='./v1.0.0/eyesmedia.RIM.js';
 *    s.async = true;
 *    var x = document.getElementsByTagName('script')[0];
 *    x.parentNode.insertBefore(s, x);
 *    RIM.config = {
 *      id: 'xxxxx',
 *      autoInit: true,
 *      barFontColor: '#cccccc',
 *      barBgColor: '#cccccc',
 *      barTopSpace: '50px',
 *      spaceDOM: document.getElementById('main'),
 *      goImIcon: 'https://xxxx.png',	
 *    };
 *  })();
 * </script>
 * 
 * 外部可設定參數: 
 * accountKey    {string}    require   企業帳號id (也就是: 中台的 accountId, stomp中的 X-ACCOUNT)
 * id            {string}    require   指定知識庫id
 * autoInit      {boolean}   Optional  是否要立刻初始化
 * barFontColor  {string}    Optional  richnebu bar 文字顏色
 * barBgColor    {string}    Optional  richnebu bar 背景顏色
 * spaceDOM      {html DOM}  Optional  指定與 richmenu bar 有空間範圍的某個 html 元素 ( 搭配 barTopSpace 使用 )
 * barTopSpace   {string}    Optional  某個 html 元素與 richmenu bar 的空間範圍數值 ( 搭配 spaceDOM 使用 )
 * goImIcon      {string}    Optional  回到 im 的 icon 圖檔 url
 * 
 * 外部可呼叫方法:
 * set methods
 *   setSpaceDOM(dom)              入參 dom: 同 spaceDOM 定義
 *   init(qaCardSetId, callback)   入參 qaCardSetId: 同 id 定義, callback 初始化後ajax成功的回呼函式
 *   destroy()                     解除 richmenu 的套用, return boolean
 * 
 * get methods
 *   getHaveRichmenu               取得中台是否有設置 richmenu, return boolean
 *   clickBar(isHide, menuHeight)  當點擊richmenu bar時的回呼函式,
 *                                   回參 isHide: 宮格介面是否為關閉狀態
 *                                   回參 menuHeight: 宮格介面的高度
*/
(function (document, window) {
  // 套件的核心物件
  var RIM = {
    accountKey: null,
    id: null,    // qaCardSetId
    autoInit: true,
    spaceDOM: null,
    barFontColor: '#fff',
    barBgColor: '#4f628d',
    barTopSpace: 0,
    goImIcon: (function() {
      // 回到 IM 的 icon (預設值是svg, 外部可以自行指定圖檔)
      var re = '';
          re += '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"';
          re += '  viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">';
          re += '  <style type="text/css">.rim-st1{fill:#FFFFFF;}</style>';
          re += '  <path class="rim-st1" d="M46,20.6H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0';
          re += '    C48.7,19.4,47.5,20.6,46,20.6z"/>';
          re += '  <path class="rim-st1" d="M46,32.7H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0';
          re += '    C48.7,31.5,47.5,32.7,46,32.7z"/>';
          re += '  <path class="rim-st1" d="M46,44.8H14c-1.5,0-2.7-1.2-2.7-2.7l0,0c0-1.5,1.2-2.7,2.7-2.7h32c1.5,0,2.7,1.2,2.7,2.7l0,0';
          re += '    C48.7,43.7,47.5,44.8,46,44.8z"/>';
          re += '</svg>';
      return re;
    }()),
    init: initFn,
    setSpaceDOM: setSpaceDOMFn,
    getHaveRichmenu: getHaveRichmenuFn,
    clickBar: function() { return },
    destroy: destroyFn
  };

  // 合併外部的定義至物件
  for (var item in window.RIM.config) {
    RIM[item] = window.RIM.config[item];
    // 特別處理 goImIcon
    if (item === 'goImIcon') {
      RIM.goImIcon = '<img src="' + window.RIM.config.goImIcon + '" alt="go to bot site">';
    }
  }
  window.RIM = RIM; // 揭露此物件到全域物件下

  // private variable: model
  var isInit = false,        // 用已記錄只能一次初始化
      cssLoaded = false,     // 記錄當下網頁是否已經載入過css檔
      hostName = null,       // 記錄當下瀏覽器的url
      urlParm = null,        // 記錄當下瀏覽器的url參數
      imURL = null,          // 記錄該 qaCardSetId 對應的 im 站台
      goImLink = null,       // 紀錄該 qaCardSetId 對應的完整 im 站台路徑
      inSide = null,         // 記錄是否在第三方網站上
      isHaveRichMenu = null, // 紀錄是否有設置 richmenu, null代表尚未知道, true有, false沒有
      resouceData = null,    // 記錄 ajax 回傳的資料用
      wordsCloseBtn = (function() {
        var re = '';
            re += '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"';
            re += 'viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">';
            re += '<style type="text/css">.rim-st2{fill:#4F628D;}</style>';
            re += '<g><path class="rim-st2" d="M17.8,15l5.3-5.3c0.8-0.8,0.8-2.1,0-2.8v0c-0.8-0.8-2.1-0.8-2.8,0L15,12.2L9.7,';
            re += '6.9c-0.8-0.8-2.1-0.8-2.8,0v0c-0.8,0.8-0.8,2.1,0,2.8l5.3,5.3l-5.3,5.3c-0.8,0.8-0.8,2.1,0,2.8s2.1,0.8,2.8,';
            re += '0l5.3-5.3l5.3,5.3c0.8,0.8,2.1,0.8,2.8,0s0.8-2.1,0-2.8L17.8,15z"/></g></svg>';
        return re;
      }()),
      /* littleIcon = (function () { // 收發話介面中的對話用小icon //TODO...暫時不使用
        var re = '';
        re += '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"';
        re += '  viewBox="0 0 13 13" style="enable-background:new 0 0 13 13;" xml:space="preserve">';
        re += '<style type="text/css">.rim-st3{fill:#0C1D43;}.rim-st4{fill:#FFFFFF;}</style>';
        re += '<circle class="rim-st3" cx="6.5" cy="6.5" r="6.5"/>';
        re += '<path class="rim-st4" d="M10.1,3.8c-0.3-0.3-0.8-0.3-1.2,0l-3,3.9L4,5.9c-0.3-0.3-0.8-0.3-1.2,0s-0.3,0.8,0,1.2l2.5,2.5';
        re += '  c0.2,0.2,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.3L10.1,5C10.4,4.7,10.4,4.1,10.1,3.8z"/>';
        re += '</svg>';
        return re;
      }()), */
      textBtnIdList = [],    // 紀錄有哪幾個宮格 messageType 是 TEXT 時對應的 id 用
      redirectText = null,   // 紀錄詢問是否要返回 im 時所要自動發話的內容
      /* 前端定義的樣板格式, key name 對應到後端定義的宮格樣板名稱
      *    cell  number   一個格子是幾分之幾 
      *    h     boolean  格式是否為長版 
      */
      gridType = { 
        F01: [
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false}
        ],
        E01: [
          {cell:2, h:false},
          {cell:2, h:false},
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false}
        ],
        D01: [
          {cell:4, h:true},
          {cell:4, h:true},
          {cell:4, h:true},
          {cell:4, h:true}
        ],
        D02: [
          {cell:2, h:false},
          {cell:2, h:false},
          {cell:2, h:false},
          {cell:2, h:false}
        ],
        C01: [
          {cell:3, h:true},
          {cell:3, h:true},
          {cell:3, h:true}
        ],
        C02: [
          {cell:1, h:false},
          {cell:2, h:false},
          {cell:2, h:false}
        ],
        B01: [
          {cell:2, h:true},
          {cell:2, h:true}
        ],
        A01: [
          {cell:1, h:true}
        ],
        A02: [
          {cell:1, h:false}
        ],
        B02: [
          {cell:2, h:false},
          {cell:2, h:false}
        ],
        C03: [
          {cell:3, h:false},
          {cell:3, h:false},
          {cell:3, h:false}
        ],
        D03: [
          {cell:4, h:false},
          {cell:4, h:false},
          {cell:4, h:false},
          {cell:4, h:false}
        ],
      };

  // private variable: catch html DOM
  var $head = document.getElementsByTagName('head')[0],
      $cssLink  = document.createElement('link'),
      $body = document.getElementsByTagName('body')[0],
      $RIMRootBox, $RIMbarItemBox, $RIMbarBtn, $RIMwordsBox, $RIMcloseBtn;
  
  // private method: 取得 hostname
  function getHostName () {
    return location.origin + location.pathname;
  }

  // private method: 取得 url 參數
  function getUrlVars () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      if (Array.isArray(hash[0], vars) > -1) {
        vars[hash[0]] = hash[1];
      }
    }
    return vars;
  }

  // private method: 載入 css 樣式
  function loadCss (callback) {
    $cssLink.id = 'eyesmedia_rim_css';
    $cssLink.rel  = 'stylesheet';
    $cssLink.type = 'text/css';
    $cssLink.href = window.RIM.cssPath; //正式用
    //$cssLink.href = 'https://sit.eyesmedia.com.tw/sdk/js/richmenu/develop/eyesmedia.rim.css'; //開發用
    //$cssLink.href = 'http://127.0.0.1:8080/eyesmedia.rim.css'; //local端有起套件live-server時
    $cssLink.onload = function () {
      cssLoaded = true;
      callback();
    };
    $head.appendChild($cssLink);
  }

  // private method: 建立套件的 html -> 事件註冊
  function createTemplateHtml () { 
    var template = '';
      if (inSide) {
        template += '<div class="eyemedia-rim-area">';
      } else {
        template += '<div class="eyemedia-rim-area outSide">';
      }
      // bar介面
      template += ' <div class="rim-ctrl-box" style="background-color: ' + RIM.barBgColor + ';" id="eyesmedia_rim_root_box' + RIM.id + '">';
      template += '   <a class="rim-home-btn" href="' + goImLink + '" aria-label="go to bot site">'; 
      template +=       RIM.goImIcon;
      template += '   </a>';
      template += '   <div class="rim-ctrl-txt rim-hide">';
      template += '     <span id="eyesmedia_rim_btn' + RIM.id + '" style="color: ' + RIM.barFontColor + ';">';
      template +=         resouceData.richMenuListModel.menuTitle;
      template += '     </span>';
      template += '   </div>';
      template += ' </div>';
      // 宮格介面
      template += ' <div class="rim-item-box rim-absolute rim-hide" id="eyesmedia_rim_item_box' + RIM.id + '"';
      template += '   style="background-image: url(' + resouceData.richMenuListModel.backgroundImage + ')">';
      // 依照後端的資料決定要組成怎樣的宮格樣式
      for (var i = 0; i < gridType[resouceData.richMenuListModel.templateType].length; i++) {
        var cellNum = gridType[resouceData.richMenuListModel.templateType][i].cell, // 利用css名稱中的數字
            isHeight = gridType[resouceData.richMenuListModel.templateType][i].h,
            heightClass = (isHeight)? 'rim-item-H' : '', // 長版的css名稱
            messageType = resouceData.richMenuListModel.richMenuUnits[i].messageType,
            isText = (messageType === 'TEXT')? true : false,
            content = resouceData.richMenuListModel.richMenuUnits[i].content,
            textBtnID = (isText)? 'eyesmedia_rim_textBtnID_' + i : '';

        if (messageType === 'TEXT') { // 文字
          textBtnIdList.push(textBtnID);
          template += '<div  class="rim-item rim-item-' + cellNum + 'cell ' + heightClass + '"><a'; 
          template += ' id="' + textBtnID + '" content="' + content + '" aria-label="自動發話">';
        } 
        if (messageType == 'LINK') { // 連結
          if (content.indexOf("http") < 0) content = 'https://' + content;
          template += '<div class="rim-item rim-item-' + cellNum + 'cell ' + heightClass + '"><a href="' + content + '" aria-label="前往連結">';
        }
        if (messageType === 'OPEN_WINDOW') { // 連結另開視窗
          if (content.indexOf("http") < 0) content = 'https://' + content;
          template += '<div class="rim-item rim-item-' + cellNum + 'cell ' + heightClass + '"><a href="' + content + '" target="_blank" aria-label="前往連結">';
        }
        if (messageType === 'SCRIPT') { //SCRIPT
          template += '<div  class="rim-item rim-item-' + cellNum + 'cell ' + heightClass + '"><a'; 
          template += ' class="eyesmedia_rim_scriptBtn" content="' + content + '" aria-label="客製化腳本">';
        }
        template += '</a></div>';
      }
      template += ' </div>';

      // 收發話介面
      template += ' <div class="rim-words-box" style="background-image: url(' + resouceData.robotConfigModel.robotBase64BackgroundImage + ')" id="eyesmedia_rim_words_box' + RIM.id + '">';
      template += '   <div class="rim-close-btn" id="eyesmedia_rim_close_btn' + RIM.id + '">' + wordsCloseBtn + '</div>';
      //template += '   <div class="rim-words-send-box">';
      //template += '     <div class="rim-words-times">下午02:09</div>';
      //template += '     <div class="rim-words-text">';
      //template += '       真愛碼頭';
      //template += '     </div>';
      //template += '     <i class="rim-words-little-icon">' + littleIcon + '</i>';
      //template += '   </div>';
      //template += '   <div class="rim-words-receive-box">';
      //template += '     <img class="rim-words-bot" src="' + resouceData.robotConfigModel.robotBase64Image + '">';
      //template += '     <div class="rim-words-times"><span class="rim-words-bot-name">' + resouceData.robotConfigModel.robotName + '</span>下午02:09</div>';
      //template += '     <div class="rim-words-text">';
      //template += '       位在五福路橋旁的真愛碼頭(原12號碼頭)，以雙座風帆的造型，分別對著高雄市區及旗津渡輪碼頭，在此可眺望高雄海港體驗大船入港的震撼，白天、夜晚各具不同的風貌，與真愛碼頭對望的為光榮碼頭，多次舉辦大型活動，吸引海內外遊客來此遊玩。';
      //template += '     </div>';
      //template += '   </div>';
      template += '   是否要離開此頁面，前往' + resouceData.robotConfigModel.serviceName + '？';
      template += '   <div class="rim-toIm">';
      // a 不直接給 href, 後面程序要判斷是直接發話, 或是要導頁到 im 網站中的一個頁面去觸發代發訊息的頁面, 並且將要代發參數帶到 url 中
      template += '     <a aria-label="立即前往">'; 
      template += '       立即前往';
      template += '     </a>';
      template += '   </div>';
      template += ' </div>';
      template += ' ';
      template += '</div>';
    $body.insertAdjacentHTML('beforeend', template);
    $RIMRootBox = document.getElementById('eyesmedia_rim_root_box' + RIM.id);
    $RIMbarItemBox = document.getElementById('eyesmedia_rim_item_box' + RIM.id);
    $RIMbarBtn = document.getElementById('eyesmedia_rim_btn' + RIM.id);
    $RIMwordsBox = document.getElementById('eyesmedia_rim_words_box' + RIM.id);
    $RIMcloseBtn = document.getElementById('eyesmedia_rim_close_btn' + RIM.id);
    $RIMscripBtn = document.getElementsByClassName('eyesmedia_rim_scriptBtn');

    // 事件註冊
    // click bar介面的文字區塊
    $RIMbarBtn.addEventListener('click', function() {
      // 宮格選單介面出現或隱藏
      var nowClassName = $RIMbarItemBox.className,
          isHide = (nowClassName.indexOf('rim-hide') > 0)? true : false;
      if (isHide) {//關閉 > 打開
        $RIMbarItemBox.setAttribute('class', 'rim-item-box rim-absolute');
        $RIMbarBtn.parentElement.setAttribute('class', 'rim-ctrl-txt');
      } else {//打開 > 關閉
        $RIMbarItemBox.setAttribute('class', 'rim-item-box rim-absolute rim-hide');
        $RIMbarBtn.parentElement.setAttribute('class', 'rim-ctrl-txt rim-hide');
      }
      // 關閉收發話介面
      $RIMcloseBtn.click();
      // 回呼外部設定 callback
      window.RIM.clickBar(!isHide, $RIMbarItemBox.offsetHeight);
    }, false);

    // click 關閉收發話介面的關閉按鈕
    $RIMcloseBtn.addEventListener('click', function() {
      $RIMwordsBox.setAttribute('class', 'rim-words-box rim-hide');
    }, false);

    // 針對宮格是 TEXT 做事件註冊
    for (var i = 0; i < textBtnIdList.length; i++) {
      var id = textBtnIdList[i];
      document.getElementById(id).addEventListener('click', function(event) {
        // 取得紀錄在 attribute 上的資料
        redirectText = document.getElementById(event.target.id).getAttribute("content");
        // 判斷是否在 IM 中, 如果是就發送訊息, 如果是第三方網站就打開 $RIMwordsBox 介面
        if (inSide) {
          // console.log('在IM中');
          window.eyesmedia_sendMssage(redirectText);
          $RIMbarBtn.click(); // 關閉宮格介面
          return false;
        }
        // 將要發送的文字放到 a 連結去
        redirectText = document.getElementById(event.target.id).getAttribute("content");
        var $a = $RIMwordsBox.getElementsByTagName('a')[0];
        var replaceURL = new URL(imURL);
        var redirectUrl = replaceURL.origin + replaceURL.pathname + 'redirect' + replaceURL.search
        var link = redirectUrl + '&content=' + redirectText; 
        $a.setAttribute('href', link);
        // 宮格區塊的高度
        var H = $RIMbarItemBox.offsetHeight; 
        $RIMwordsBox.setAttribute('class', 'rim-words-box rim-show');
        $RIMwordsBox.setAttribute('style', 'height: ' + H + 'px; background-image: url(' + resouceData.robotConfigModel.robotBase64BackgroundImage + ');');
      }, false);
    }

    // 針對宮格是 SCRIPT 做事件註冊
    if ($RIMscripBtn.length) {
      [].forEach.call($RIMscripBtn, function (el) {
        el.addEventListener('click', function (event) {
          var url = event.target.getAttribute('content');
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = url;
          s.id= 'TMS_richmenu_script';
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
        });
      });
    }

    // 是否預設是打開的 richmenu
    if (resouceData.richMenuListModel.displayType === 'SHOW') {
      setTimeout(function() {
        $RIMbarBtn.click();
      }, 500);
    }
  }

  // public method: 設定 spaceDOM
  function setSpaceDOMFn (dom) {
    RIM.spaceDOM = dom;
  }

  // public method: 取得該是否有設置 richmenu
  function getHaveRichmenuFn () {
    return isHaveRichMenu;
  }

  // public method: 解除 richmenu 的套用
  function destroyFn () {
    if (isInit) {
      $RIMRootBox.remove();
      $RIMRootBox = undefined;
      if (RIM.spaceDOM) {
        RIM.spaceDOM.style.marginBottom = 'auto';
      }
      isInit = false;
    }
    if (isInit === null) { //正在初始化中
      return false;
    }
    return true;
  }

  /** public method: 初始化
   * qaCardSetId  {string}       //考慮到外部一開始 config 沒有設定時, 可以透過 initFn 在給 RIM.qaCardSetId 值
   * successcallback  {function} 
  */
  function initFn (qaCardSetId, successcallback) {
    var successcallback = successcallback;
    //防呆
    if (!RIM.accountKey) {
      console.error('accountKey is undefined');
      return false;
    }
    if (!qaCardSetId) {
      console.error('qaCardSetId is undefined');
      return false;
    }
    if (isInit) {
      console.error('Can only be initialized once');
      return false;
    }
    if (isInit === null) {
      console.error('initialization in progressing');
      return false;
    }

    isInit = null; //正在初始化中
    RIM.id = qaCardSetId;

    /** 透過 ajax 撈取該 qaCardSetId 使用的 richmenu 的設定
     * 目前使用原生的 window.fetch 當作 ajax 的方案是網路上目前大多數做 js sdk 所使用的方法
     * 原生 fetch 參考 https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch
    */
    var path = window.RIM.apiDomain + window.RIM.apiPath + RIM.id + '/WEB'; //正式用
    //var path = 'https://sit.eyesmedia.com.tw/mgt-console/api/v1/sdk/richmenu/device/' + RIM.id + '/WEB'; //本地開發用
    fetch(path, {
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json',
        'X-ACCOUNT': RIM.accountKey
      },
      mode: 'cors',
    }).then(function(response) {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(response) {
      //除了 '996600001, 286610002' 以外的都當作ajax失敗
      if (response.errorCode !== '996600001' && response.errorCode !== '286610002') {
        isInit = false;
        isHaveRichMenu = false;
        throw new Error('errorCode: ' + response.errorCode);
      }
      //中台沒有設定時
      if (response.errorCode === '286610002') {
        isHaveRichMenu = false;
        successcallback(isHaveRichMenu);
        return false;
      }
      //以下為中台有設定時的程序
      isInit = true;
      resouceData = response.data;
      isHaveRichMenu = true;
      hostName = getHostName();
      imURL = resouceData.serviceCtrlModel.custmizSetting.imLinkUrl;
      goImLink = imURL;
      inSide = (goImLink.indexOf(hostName) === -1)? false : true;

      if (typeof successcallback === 'function') {
        successcallback(isHaveRichMenu);
      }

      // 外部指定要從哪一個 dom 元素加高空白空間給 .eyemedia-rim-area 浮動的情況下不會壓到內容
      if (RIM.spaceDOM) {
        RIM.spaceDOM.style.marginBottom = RIM.barTopSpace;
      }

      // 載入套件的 css > 建立 html
      if (!cssLoaded) {
        loadCss(createTemplateHtml);
      } else {
        createTemplateHtml();
      }
    }).catch(function(err) {
      console.error('There has been a problem: ', err.message);
    });
  }

  urlParm = getUrlVars();

  if (RIM.autoInit) {
    initFn(RIM.id);
  }
}(document, window));