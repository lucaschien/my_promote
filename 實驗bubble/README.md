# eyesmedia-js-sdk: bubble

### 資料夾結構
- ***develop***
  - /js/bubble.js 套件的js原始檔
  - /scss/ 套件的scss原始檔
  - /css/ 本地端開發期間將scss打包成本地端css檔
  - 
- ***dist***
  - 執行發佈後的檔案存放位置

### 開發環境安裝
1. 安裝node.js
2. 安裝live-server到全局 
3. 安裝gulp到全局 
```
安裝專案套件:
npm install

安裝本地端server:
npm install -g live-server

安裝gulp到全局:
npm install --global gulp
```

### 本地端開發指令
```
npm run dev
```

### 發佈
> *如果發佈時要升版,須先修改 package.json 中 "versionNumber" 的版號在執行發佈指令*
```
發佈指令
npm run sit
```

### 上傳發佈檔
手動上傳 dist 資料夾中的檔案到 Amazon S3 的 cdn, 需注意 cdn 上面的資料夾分法.
