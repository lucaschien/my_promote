/** 泡泡套件 
 * author: lucas
 * 
 * dependent: window.Fetch
 * support browser: Chrome 42^, Firefox 39^, Safari 10.1^, 
 *                  Edge 14^, 
 * support device: iOS Safari 10.3^,  
 *                 Andorid Browser 67^
 * not support: All IE, Opera Mini
 * 
 * use example:
 *   <script id="justka-bubble" charset="utf-8" src="https://xxxx/bubble.js?bubbleId=abc&dev=sit"></script>
 * 
 * 
 * 
 * 注意:由於是封閉式的SDK,在這邊的程式不能有污染全域的行為.
 * 
 * 注意:SDK打包時會在 window 全域下掛一個 JustkaBubble 的物件
*/
(function (document, window) {
  // 套件內部的核心物件
  var JUSTKA = {
    // 記錄 script tag src 後面的參數
    srcParameter: {
      bobbleId: null,
      dev: 'biz',       // 對應的開發環境 (預設biz)
    },
    // 記錄中台設定好的資料用
    configData: null,
    // 記錄iframe中的im相關初始化是否已經完成用
    imIsloaded: false,
  };

  // 記錄重要的DOM用
  var $bubbleArea = null;
  var $bubbleBtn = null;
  var $iframeBox = null;
  var $description = null;

  // svg 叉叉 icon
  var closeSVG = `
    <?xml version="1.0" encoding="utf-8"?>
    <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="lavel_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 14.2 14.2" style="enable-background:new 0 0 14.2 14.2;" xml:space="preserve">
    <path d="M7.8,7.1l3.5-3.5c0.2-0.2,0.2-0.5,0-0.7s-0.5-0.2-0.7,0L7.1,6.4L3.6,2.8C3.4,2.6,3,2.6,2.8,2.8s-0.2,0.5,0,0.7l3.5,3.5
      l-3.5,3.5c-0.2,0.2-0.2,0.5,0,0.7c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1l3.5-3.5l3.5,3.5c0.1,0.1,0.2,0.1,0.4,0.1s0.3,0,0.4-0.1
      c0.2-0.2,0.2-0.5,0-0.7L7.8,7.1z"/>
    </svg>
  `;

  // svg 機器人
  var boubleSVG = `
  <?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg version="1.1" class="bot-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 121.9 104.9" style="enable-background:new 0 0 121.9 104.9;" xml:space="preserve">
  
    <defs>
      <style>
        .ae9949ce-962e-451a-9d88-085bb77e279a,
        .b2931284-4e3b-4bc8-8d4c-e305bd7637d4{fill:#fff;}
        .b390e02c-b190-4faa-8645-9dbf7b9457c9{fill:url(#ec30617b-ea4d-4086-b296-c1607d5b2d3a);}
        .a8c2b248-d5fb-446f-98e6-fd9c01e81c57{fill:url(#b59008ef-b9a4-44ea-80a0-418f1b36144b);}
        .a3c542fe-2cd2-4f65-82bd-61bca4f8cd06{fill:#4e4d4d;}
        .a91ba7b6-5227-473d-974a-fc1ef92df7b4{clip-path:url(#b0dad690-9afb-430f-a960-17c7b125ef21);}
        .a7e2e221-5c5d-4136-8ebd-eee70bb9700e{fill:url(#a503e970-e9af-4f4b-8d3e-87ebd848ecb1);}
        .loading-eyes-face {
          visibility: hidden;
        }
        .loading-line {
          fill:none;
          stroke:#72c8d5;
          stroke-linecap:round;
          stroke-linejoin:round;
          stroke-width: 2;
        }
        .loading-dot {
          fill: #72c8d5; 
          transform: translate(-38px, -46px);
        }
        .close-eyes {
          fill:none;
          stroke:#72c8d5;
          stroke-width:3.9174;
          stroke-linecap:round;
          stroke-linejoin:round;
          stroke-miterlimit:10;
        }
        .open-eyes {
          fill:none;
          stroke:#72c8d5;
          stroke-width:3.9174;
          stroke-miterlimit:10;
        }
      </style>
      <radialGradient id="ec30617b-ea4d-4086-b296-c1607d5b2d3a" cx="-233.77" cy="468.82" r="1" gradientTransform="translate(-25113.73 41520.34) rotate(-175.21) scale(92.54)" gradientUnits="userSpaceOnUse">
        <stop offset="0.01" stop-color="#7f8080" stop-opacity="0.8"/><stop offset="0.95" stop-color="#fff"/>
      </radialGradient>
      <radialGradient id="b59008ef-b9a4-44ea-80a0-418f1b36144b" cx="-224.46" cy="451.4" r="1" gradientTransform="translate(-4584.74 7816.36) rotate(-175.21) scale(17.9)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#7f8080" stop-opacity="0.43"/>
        <stop offset="0.77" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="b0dad690-9afb-430f-a960-17c7b125ef21">
        <path class="ae9949ce-962e-451a-9d88-085bb77e279a" d="M5.3,44.29C3.23,68.92,26.48,91,57.24,93.6a68.87,68.87,0,0,0,8.38.18h.06c.56,0,1.13-.05,1.69-.09,26.92-1.3,34.78,2.49,38.78,6.67a1.78,1.78,0,0,0,1.62.49,1.82,1.82,0,0,0,.79-.38,1.77,1.77,0,0,0,.5-.71c7.72-19.57,7.84-49.07,7.84-49.07l-.13,0c.11-23.5-22.51-44-52.06-46.45C34,1.72,7.36,19.66,5.3,44.29Z"/>
      </clipPath>
      <radialGradient id="a503e970-e9af-4f4b-8d3e-87ebd848ecb1" cx="-230.71" cy="452.4" r="1" gradientTransform="matrix(-34.47, -6.48, 2.63, -8.56, -9087.04, 2463.75)" gradientUnits="userSpaceOnUse">
        <stop offset="0.03" stop-color="#fff" stop-opacity="0.2"/>
        <stop offset="0.33" stop-color="#fff" stop-opacity="0.13"/>
        <stop offset="0.8" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    
    <g data-name="m-svg-group">

      <g data-name="m-body">
        <path class="b2931284-4e3b-4bc8-8d4c-e305bd7637d4" d="M5.3,44.29C3.23,68.92,26.48,91,57.24,93.6a68.87,68.87,0,0,0,8.38.18h.06c.56,0,1.13-.05,1.69-.09,26.92-1.3,34.78,2.49,38.78,6.67a1.78,1.78,0,0,0,1.62.49,1.82,1.82,0,0,0,.79-.38,1.77,1.77,0,0,0,.5-.71c7.72-19.57,7.84-49.07,7.84-49.07l-.13,0c.11-23.5-22.51-44-52.06-46.45C34,1.72,7.36,19.66,5.3,44.29Z"/>
        <path class="b390e02c-b190-4faa-8645-9dbf7b9457c9" d="M4.87,44.21C2.79,69,26.18,91.23,57.13,93.82a69.74,69.74,0,0,0,8.43.18h.06l1.7-.09c27.08-1.31,35,2.51,39,6.71a1.88,1.88,0,0,0,.75.46,1.75,1.75,0,0,0,.88,0,1.82,1.82,0,0,0,.79-.38,1.76,1.76,0,0,0,.51-.72c7.76-19.68,7.88-49.37,7.88-49.37l-.12.05C117.14,27.06,94.37,6.46,64.65,4,33.7,1.38,6.94,19.42,4.87,44.21Z"/>
        <path class="a8c2b248-d5fb-446f-98e6-fd9c01e81c57" d="M4.87,44.21C2.79,69,26.18,91.23,57.13,93.82a69.74,69.74,0,0,0,8.43.18h.06l1.7-.09c27.08-1.31,35,2.51,39,6.71a1.88,1.88,0,0,0,.75.46,1.75,1.75,0,0,0,.88,0,1.82,1.82,0,0,0,.79-.38,1.76,1.76,0,0,0,.51-.72c7.76-19.68,7.88-49.37,7.88-49.37l-.12.05C117.14,27.06,94.37,6.46,64.65,4,33.7,1.38,6.94,19.42,4.87,44.21Z"/>
        <path class="a3c542fe-2cd2-4f65-82bd-61bca4f8cd06" d="M18,44.34l-.19,2.26c-.77,9.15,6,20.79,15.19,21.55l52.71,4.42c9.15.76,17.19-9.63,18-18.78l.19-2.26c.76-9.15-6-21.3-15.19-22.06L36,25.05C26.85,24.29,18.81,35.19,18,44.34Z"/>
        <g class="a91ba7b6-5227-473d-974a-fc1ef92df7b4">
          <path class="a7e2e221-5c5d-4136-8ebd-eee70bb9700e" d="M100.88,93.7c1.9-6.17-16.75-15-41.64-19.65s-46.62-3.47-48.52,2.7,16.75,15,41.65,19.65S99,99.88,100.88,93.7Z"/>
        </g>
      </g>

      <g data-name="open-eyes">
        <path class="open-eyes" d="M88.1,50.4c0.5-6.5-3.3-12.2-8.6-12.6c-5.3-0.4-10,4.5-10.6,11c-0.5,6.5,3.3,12.2,8.6,12.6
          S87.5,56.9,88.1,50.4z"/>
        <path class="open-eyes" d="M50.1,47.1c0.5-6.5-3.3-12.2-8.6-12.6c-5.3-0.4-10,4.5-10.6,11c-0.5,6.5,3.3,12.2,8.6,12.6
          C44.8,58.5,49.6,53.6,50.1,47.1z"/>
      </g>

      <g data-name="close-eyes">
        <path class="close-eyes" d="M50,48.3c-1.7-2.1-5.3-3.6-9.4-3.9s-7.5,0.7-9.7,2.5"/>
        <path class="close-eyes" d="M87.9,51.7c-1.7-2.1-5.3-3.6-9.4-3.9s-7.5,0.7-9.7,2.5"/>
      </g>
  
      <g data-name="loading-eyes-face" class="loading-eyes-face">
        <line class="loading-line" 
          x1="29.8" y1="45.46" x2="92.68" y2="50.99">
        </line>
        <g>
          <path class="loading-dot" 
            d="M44.6,46.7c0,0-3.6,4.7-7.6,4.4s-6.7-5.6-6.7-5.6s3.6-4.7,7.6-4.4S44.6,46.7,44.6,46.7z">
          </path>
          <animateMotion dur="1s" repeatCount="indefinite">
            <mpath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#dot-animate-line"></mpath>
          </animateMotion>
          <path id="dot-animate-line" fill="none" d="M37,46.1c0,0,18.3,1.6,22.4,2c4.1,0.4,26.4,2.3,26.4,2.3L37,46.1"/>
        </g>
      </g>

    </g>
  </svg>
  `;

  // 取得網頁中最大的 z-index 值
  function calcZindex() {
    var $allDom = Array.from(document.body.querySelectorAll('*'));
    var lastIndex = 0;
    $allDom.forEach((item) => {
      let itemIndex = window.getComputedStyle(item).zIndex;
      if (itemIndex !== 'auto') {
        lastIndex = (parseInt(itemIndex) >= lastIndex)? parseInt(itemIndex) : lastIndex;
      }
    });
    return (lastIndex+1 <=1 )? 2 : lastIndex + 1; // 預抓最小為2
  }

  // 取得 js path 參數
  function gatSrcParameter() {
    if (document.getElementById('justka-bubble')) {
      // 提醒:固定用 justka-bubble
      var scriptPath = document.getElementById('justka-bubble').getAttribute('src');
      var vars = {}, hash;
      var hashes = scriptPath.slice(scriptPath.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (Array.isArray(hash[0], vars) > -1) {
          vars[hash[0]] = hash[1];
        }
      }
      JUSTKA.srcParameter = { ...vars };
      console.log('JUSTKA...', JUSTKA);
      // 參數正確執行初始化流程
      if (JUSTKA.srcParameter.bubbleId) {
        init();
      }
    }
  }

  // 載入套件 css
  function loadCSS(callback) {
    var $cssLink = document.createElement('link');
    $cssLink.rel  = 'stylesheet';
    $cssLink.type = 'text/css';
    //注意這css路徑是設定在環境變數上
    $cssLink.href = window.JustkaBubble.cssPath;
    $cssLink.onload = callback;
    document.getElementsByTagName('head')[0].appendChild($cssLink);
  }

  // 取得中台設定好的資料
  function getConfig(callback) {
    // TODO... 用 setTimeout 假裝 ajax
    setTimeout(function() {
      /* TODO... 假設後端會給我的資料 */
      JUSTKA.configData = {
        provision: '8feed844-c12d-4e83-8ea9-ab4b5d859558',   // 機器人id     
        account: 'd3f53a60-db70-11e9-8a34-2a2ae2dbcce4',     // 企業帳號id
        config: {
          welcomeWord: '哈囉您好! 有需要幫忙的地方,歡迎找我喔!',  // 歡迎詞
          bgColor: '#89e3e9',   // 泡泡按鈕背景顏色 #89e3e9
          bgOpacity: 0.8,       // 泡泡按鈕背景顏色透明度 0 ~ 1
          size: 'L',            // 泡泡按鈕尺寸: S小 M中 L大
          useBlur: true,        // 泡泡按鈕背景是否要有羽化效果  TODO... 思考blur程度是否要讓使用者自己設定
          // TODO... 之後思考是否連座標位置都可以從中台設定
        },
        // 促銷活動
        promotion: {}
      };
      console.log('假裝取得中台設定好的資料:', JUSTKA);
      callback();
    }, 1000);
  }

  // 建立泡泡等相關DOM元素
  function createBubbleDoms() {
    // 建立泡泡的大容器
    var lastIndex = calcZindex();
    $bubbleArea = document.createElement('div');
    $bubbleArea.classList.add('justka-bubble-area');
    $bubbleArea.classList.add('hide');
    $bubbleArea.setAttribute('style', 'z-index:' + lastIndex);
    
    // 建立泡泡的按鈕
    $bubbleBtn = document.createElement('div');
    $bubbleBtn.classList.add('justka-bubble-btn');
    $bubbleBtn.classList.add(JUSTKA.configData.config.size); // 泡泡尺寸
    $bubbleBtn.innerHTML = boubleSVG; // svg字串

    // 建立按鈕背景 svg 
    var $bgSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // 背景用svg
    $bgSvg.setAttribute('width', '100%');
    $bgSvg.setAttribute('height', '100%');

    // 建立按鈕背景圓形物件
    var $ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    var bgColor = (JUSTKA.configData.config.bgColor)? JUSTKA.configData.config.bgColor : 'transparent';
    $ellipse.setAttribute('fill', bgColor); // 泡泡背景顏色
    $ellipse.setAttribute('cx', '50%');
    $ellipse.setAttribute('cy', '50%');
    $ellipse.setAttribute('rx', '40%');
    $ellipse.setAttribute('ry', '40%');
    $ellipse.setAttribute('opacity', JUSTKA.configData.config.bgOpacity);  // 泡泡背景透明度

    // 泡泡背景與羽化效果
    if (JUSTKA.configData.config.useBlur) {
      var $radialGradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
      $radialGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      $radialGradient.setAttribute('id', 'radialBlur');
      $radialGradient.setAttribute('cx', '50%');
      $radialGradient.setAttribute('cy', '50%');
      $radialGradient.setAttribute('r', '50%');
      $radialGradient.innerHTML = `
        <stop offset="0.5" style="stop-color:${bgColor}; stop-opacity:1"/>
        <stop offset="0.8" style="stop-color:${bgColor}; stop-opacity:0"/>
      `;
      $ellipse.setAttribute('fill', 'url(#radialBlur)');
      $bgSvg.appendChild($radialGradient);
      $bgSvg.appendChild($ellipse);
    }
    $bgSvg.appendChild($ellipse);
    $bubbleBtn.appendChild($bgSvg);
    $bubbleArea.appendChild($bubbleBtn);

    // 建立一開始泡泡歡迎詞區塊
    $description = document.createElement('div');
    $description.classList.add('description-box');
    $description.classList.add('hide');
    var htmlString = `<div>${JUSTKA.configData.config.welcomeWord}</div><div class="close-btn" id="descriptionCloseBtn">${closeSVG}</div>`;
    $description.innerHTML = htmlString; 
    $bubbleArea.appendChild($description);
    
    // TODO... 再建立促銷活動相關的區塊

    // event function 整體大容器進場動畫效果結束事件
    function bubbleAreaInitEvent(event) {
      // 注意:transitionend的事件也會監聽到子元素,所以要排除子元素的觸發.
      if (event.target === $bubbleArea) {
        $description.classList.remove('hide');
        $bubbleArea.removeEventListener('transitionend', bubbleAreaInitEvent); // 進場完畢,取消事件註冊
      }
    }
    $bubbleArea.addEventListener('transitionend', bubbleAreaInitEvent, false);

    // 正式產生第一層DOM元素
    document.getElementsByTagName('body')[0].appendChild($bubbleArea);
    setTimeout(function() {
      $bubbleArea.classList.remove('hide');
    }, 0); 

    // 以下做第一層DOM的事件註冊
    // 點擊泡泡按鈕
    $bubbleBtn.addEventListener('click', function() {
      // 避免快速點擊
      if (document.getElementById('chatBotIframe')) {
        return false;
      }
      $bubbleBtn.classList.add('loading-iframe'); // 機器人表情從扎眼轉為loading的狀態
      createIframeBoxDoms();
    }, false);

    // 泡泡按鈕動畫效果結束事件
    $bubbleBtn.addEventListener("transitionend", function(event) {
      var isOpen = true; // 記錄泡泡按鈕是打開狀態
      for (var item of event.target.classList) {
        if (item === 'hide') {
          isOpen = false;
        }
      }
      if (!isOpen) {
        $iframeBox.classList.add('iframeIn');
      }
    }, false);

    // 點擊歡迎描述文字關閉按鈕
    document.getElementById('descriptionCloseBtn').addEventListener('click', function(event) {
      event.target.parentNode.classList.add('hide');
    }, false);
  }

  // 建立 iframe 容器等相關DOM元素
  function createIframeBoxDoms () {
    // 產生 iframe 與 關閉按鈕 相關DOM元素
    $iframeBox = document.createElement('div');
    $iframeBox.classList.add('justka-iframe-box');
    var index = calcZindex();
    $iframeBox.setAttribute('style', 'z-index:' + index);
    iframeSrc = window.JustkaBubble.imDomain + '/?provision=' + JUSTKA.configData.provision + '&q=' + JUSTKA.configData.provision + '&a=' + JUSTKA.configData.account;
    // var iframeSrc = `./testChild.html`;
    var $iframe = document.createElement('iframe');
    $iframe.setAttribute('id', 'chatBotIframe');
    $iframe.setAttribute('name', 'chatBotIframe');
    $iframe.setAttribute('src', iframeSrc);
    $iframeBox.innerHTML = `<div class="close-iframe-btn" id="closeIframeBtn">${closeSVG}</div>`;
    $iframeBox.appendChild($iframe);
    document.getElementsByTagName('body')[0].appendChild($iframeBox);

    // 以下做第二層DOM的事件註冊
    // iframe loaded 事件 (不含IM已經初始化)
    $iframe.addEventListener('load', function() {
      // 在此監聽 IM 是否已經初始化
      var checkIM = setInterval(function() {
        if (JUSTKA.imIsloaded) {
          document.getElementById('descriptionCloseBtn').click();
          $bubbleBtn.classList.add('hide');
          clearInterval(checkIM);
        }
        // 本地端開發時測試用
        if (JUSTKA.srcParameter.dev === 'dev') {
          JUSTKA.imIsloaded = true;
        }
      }, 400);
    }, false);

    // 關閉 iframe 的按鈕事件
    document.getElementById('closeIframeBtn').addEventListener('click', function(event) {
      $bubbleBtn.classList.remove('loading-iframe');  // 機器人表情從loading轉為扎眼的狀態
      $iframeBox.classList.remove('iframeIn');
      JUSTKA.imIsloaded = false;
    }, false);

    // iframe 大容器的動畫效果結束事件
    $iframeBox.addEventListener("transitionend", function(event) {
      var isOpen = false; // iframe大容器是打開狀態
      for (var item of event.target.classList) {
        if (item === 'iframeIn') {
          isOpen = true;
        }
      }
      if (!isOpen) {
        $bubbleBtn.classList.remove('hide');
        $iframeBox.remove();
      }
    }, false);
  }

  // 開發測試用介面
  function creatDevView() {
    var html = `
      <h3>泡泡按鈕測試面板</h3>
      <div class="classification">
        <label>尺寸</label>
        <select id="justka-bubble-size" value="${JUSTKA.configData.config.size}">
          <option value="L">大</option>
          <option value="M">中</option>
          <option value="S">小</option>
        </select>
      </div>
      <div class="classification">
        <label>背景色</label>
        <input type="color" id="justka-bubble-bgColor" value="${JUSTKA.configData.config.bgColor}">
      </div>
      <div class="classification">
        <label>背景透明度</label>
        0 <input type="range" min="0.0" max="1.0" step="0.01" 
          id="justka-bubble-bgOpacity"
          value="${JUSTKA.configData.config.bgOpacity}"> 1
      </div>
      <div class="classification">
        <label>背景羽化效果</label>
        <select id="justka-bubble-bgBlur" value="${JUSTKA.configData.config.useBlur}">
          <option value="true">Yes</option>
          <option value="false">False</option>
        </select>
      </div>
      <div class="classification">
        <label>歡迎詞</label>
        <textarea id="justka-bubble-welcomeWord"></textarea>
      </div>
    `;
    var $div = document.createElement('DIV');
    $div.classList.add('justka-bubble-devtool-area');
    $div.innerHTML = html;
    document.getElementsByTagName('body')[0].appendChild($div);
    
    // event
    document.getElementById('justka-bubble-size').addEventListener('change', function(event) {
      $bubbleArea.remove();
      JUSTKA.configData.config.size = event.target.value;
      createBubbleDoms();
    }, false);

    document.getElementById('justka-bubble-bgColor').addEventListener('change', function(event) {
      $bubbleArea.remove();
      JUSTKA.configData.config.bgColor = event.target.value;
      createBubbleDoms();
    }, false);

    document.getElementById('justka-bubble-bgOpacity').addEventListener('change', function(event) {
      $bubbleArea.remove();
      JUSTKA.configData.config.bgOpacity = event.target.value;
      createBubbleDoms();
    }, false);

    document.getElementById('justka-bubble-bgBlur').addEventListener('change', function(event) {
      console.log('welcomeWord', event.target.value);
      $bubbleArea.remove();
      JUSTKA.configData.config.useBlur = (event.target.value === 'true')? true : false;
      createBubbleDoms();
    }, false);

    document.getElementById('justka-bubble-welcomeWord').addEventListener('change', function(event) {
      $bubbleArea.remove();
      JUSTKA.configData.config.welcomeWord = event.target.value;
      createBubbleDoms();
    }, false);
  }

  // sdk 初始化
  function init() {
    // css > config > bubble btn
    loadCSS(function () {
      getConfig(function() {
        createBubbleDoms();
        // 打開本地端測試用介面
        if (JUSTKA.srcParameter.devtool === 'true') {
          creatDevView();
        }
      });
    });
  }

  // 擴充一個方法到套件環境變數,預計讓IM通知此SDK用.
  window.JustkaBubble.iframeOnload = function(isSuccess) {
    JUSTKA.imIsloaded = isSuccess;
  };

  gatSrcParameter();
}(document, window));