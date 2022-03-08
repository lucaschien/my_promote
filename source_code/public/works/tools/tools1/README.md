# eyesmedia-js-sdk: richmenu

### 資料夾結構
- ***develop***
  - eyesmedia.rim.js 套件的js原始檔
  - eyesmedia.rim.css 套件的css原始檔
  - *...其餘檔案都是開發時,方便套用的檔案*
- **v1.0.0**
  - 正式發佈的版本資料夾(由發佈指令產生)

### 開發環境
1. 安裝node.js (需有npm)
2. 安裝live-server (非必須,方便開發)
```
安裝專案套件:
npm install

起 local server:
live-server
```

###  發佈環境
1. 安裝node.js (需有npm)
2. 安裝gulp (全域安裝版本^3.9.1)
3. 執行發佈指令
> *如果發佈時要升版,須先修改 package.json 中 "build": "gulp build --version v1.0.0" 的版號在執行發佈指令*
```
發佈指令
npm run build
```

### 上傳發佈檔
> 使用 ftp 上傳 /usr/share/nginx/html/sdk/js/richmenu/vx.x.x 的資料夾 

### 其它說明請參閱 sdk.doc.md