# eyesmedia-js-sdk: richmenu

## language

 - html5
 - pure javascript ECMAScript 5
 - pure css3

## dependent

> window.Fetch

## support

### browser

> Chrome 42^, 
> Firefox 39^, 
> Safari 10.1^,
> Edge 14^
> 
>  *not support: All IE, Opera Mini*

### device

> iOS Safari 10.3^, 
> Andorid Browser 67^

## config

***accountKey*** {string} *require* 
> 帳號id

***id*** {string} *require* 
> qaCardSetId

***autoInit*** {boolean} *optional*
> 是否要立刻初始化

***barFontColor*** {string} *optional* 
> richmenu bar 文字顏色

***barBgColor*** {string} *optional*
> richmenu bar 背景顏色

***spaceDOM*** {html DOM} *optional*
> 指定與 richmenu bar 有空間範圍的某個 html 元素 *( 搭配 barTopSpace 使用 )*

***barTopSpace*** {string} *optional*
> 某個 html 元素與 richmenu bar 的空間範圍數值 *( 搭配 spaceDOM 使用 )*

***goImIcon*** {url string} *optional*
> 回到 IM 的 icon 圖檔 url

## method

***setSpaceDOM (dom)*** 
> **設定 config.spaceDOM**
> 參數 dom: 同 config.spaceDOM 定義

***init (qaCardSetId, callback)***
> **執行初始化**
> 參數 qaCardSetId: 同 config.id 定義
> 參數 callback: 初始化後回呼, return {boolean} 該 qaCardSetId 是否有設定 richmenu

***destroy ()***
> **解除 richmenu 的套用**
> 回傳:boolean 是否已經解除

***getHaveRichmenu ()***  
> **取得該 qaCardSetId 是否有設定 richmenu**  
> 回傳:取得該 qaCardSetId 是否有設定 richmenu

***clickBar (isHide, menuHeight)***
> **當點擊richmenu bar時的回呼函式**
> 回參:isHide  宮格介面是否為關閉狀態
> 回參:menuHeight  宮格介面的高度

## example

> example-1 
> 情境: 直接呼叫初始化

```
<script>
 (function() {
   RIM = window.RIM || (window.RIM = {});
   var s = document.createElement('script');
   s.type = 'text/javascript';
   s.src ='xxxx/v1.0.0/eyesmedia.RIM.js';
   s.async = true;
   var x = document.getElementsByTagName('script')[0];
   x.parentNode.insertBefore(s, x);
   RIM.config = {
    accountKey: 'xxxxx',
    id: 'xxxxx',
    autoInit: true,
    barFontColor: '#cccccc',
    barBgColor: '#cccccc',
    barTopSpace: '50px',
    spaceDOM: document.getElementById('xxx'),
    goImIcon: 'https://xxxx.png',	
   };
 })();
</script>
```
> example-2
> 情境: 滿足條件後呼叫套件執行初始化動作
```
<script>
 (function() {
   RIM = window.RIM || (window.RIM = {});
   var s = document.createElement('script');
   s.type = 'text/javascript';
   s.src ='xxxx/v1.0.0/eyesmedia.RIM.js';
   s.async = true;
   var x = document.getElementsByTagName('script')[0];
   x.parentNode.insertBefore(s, x);
   RIM.config = {
    accountKey: 'xxxxx',
    id: 'xxxxx',
    autoInit: false,
    barFontColor: '#cccccc',
    barBgColor: '#cccccc',
    barTopSpace: '50px',
    spaceDOM: document.getElementById('xxx'),
    goImIcon: 'https://xxxx.png',
   };
})();

/** 假設條件為3秒後執行套件初始化 **/
setTimeout(funciton() {
  RIM.init('xxxxxx', funciton(result) {
    //....
  });
}, 3000);
</script>
```

## 中台設定的資料在sdk中呈現說明
> 中台資料結構 (只列出sdk有使用到的欄位)
```
{
  "data": {
    "richMenuListModel": {
      "menuTitle": "0815APP", // richmenu bar 上面的文字
      "backgroundImage": "data:image/png;base64,....", // richmenu 的背景圖
      "templateType": "A02", // richmenu 的宮格設定編號
      "displayType": "SHOW", // richmenu 是否預設為打開狀態, SHOW 打開 | HIDDEN 關閉
      // richmenu 宮格上面的按鈕設定
      "richMenuUnits": [                                
        {
          "messageType": "TEXT", // 按鈕類型, TEXT發話文字 | LINK 連結 | OPEN_WINDOW 連結另開視窗
          "content": "xxx" // 按鈕內容, TEXT 代表要發話的文字, LINK | OPEN_WINDOW 代表要前往的連結
        }
      ]
    },
    "robotConfigModel": {
      "serviceName": "艾斯移動 機器人客服服務  (很多問答的那個)", // 詢問是否前往發話介面內的文字
      "robotBase64BackgroundImage": "data:image/png;base64,...." // 詢問是否前往發話介面內的背景圖
    },
    "socialProviderModel": {
      configurations: {
        url: "https://sit.eyesmedia.com.tw/webapp/" // 該 qaCardSetId 對應的 IM 網址
      }
    }
  }
}
```