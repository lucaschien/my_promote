/** annotation.js 
* @brief 文章貼標工具
* dependent on jQuery
* @author Lucas
* @date 20190125
*
* 套件帶入參數:
*  souceData     [Object] 帶入套件規定的資料
*  ※注意 souceData.entities[n] 陣列中資料的順序不可變動: [0]前端套件依賴的貼標id [1]entitie [2]文字座標 [3]文字本身 [4]是否為智能貼標(預設false)
*    {
*      "entities":[
*         ["T02", [{code:"misc", domain:"general"}], [0,2], "某某某文字", false]
*      ],  
*      "text": "整篇文章假字假字假字假字",
*      "sentenceOffsets": [[8, 26, 'q'], [26, 100, 'a']],
*      "relations": [["T02T58", "link", ["T02", "T58"]]]
*    }
*  editEntities  [Function] 編輯貼標時執行的函式 (套件回傳單筆資料)
*  editRelations [Function] 編輯關聯標籤時執行的函式 (套件回傳單筆資料)
*  callback      [Function] 每當新增貼標或關聯時的回呼函式 (套件回傳單筆資料 + 套件回傳整批資料 + 回傳方法(string))
*                           回傳方法: addEntity(新增單筆標籤), deleteEntity(刪除單筆標籤), addRelation(新增單個關聯標籤)
*
* 套件提供外部的方法有:
*  getSouceData [Function] 取得套件資料方法
*  setSouceData [Function] 給予套件資料方法
*  destroy      [Function] 破壞套件方法
*/
(function($) {
  $.fn.annotation = function (settings) {
    // 套件設定預設值
    var defaultSettings = {
      souceData: {
        entities: [],               //貼標
        text: '',                   //文章文本
        sentenceOffsets: [[0, 0]], //文章被分成幾個段落
        relations: []               //關聯標籤
      },
      editEntities: function () {},
      editRelations: function () {},
      callback: function () {}
    };

    // 外部整個設定都沒帶,用套件的預設值
    if (!settings) settings = JSON.parse(JSON.stringify(defaultSettings));

    // 如果外部沒有帶這幾個回呼函式
    if (!('editEntities' in settings) || !('editRelations' in settings) || !('callback' in settings))
      console.error('套件需要回呼函式: "editEntities" or "editRelations" or "callback"');

    // 外部沒帶欄位給予預設值
    if (!('text' in settings.souceData)) settings.souceData.text = '';
    if (!('entities' in settings.souceData)) settings.souceData.entities = [];
    if (!('sentenceOffsets' in settings.souceData)) settings.souceData.sentenceOffsets = [[0, settings.souceData.text.length]];
    if (!('relations' in settings.souceData)) settings.souceData.relations = [];

    // 檢查資料型別方法
    function checkSouceDataType (data) {
      var check = false;
      if ( $.type(data.text) !== 'string' ||
           $.type(data.entities) !== 'array' ||
           $.type(data.sentenceOffsets) !== 'array' ||
           $.type(data.relations) !== 'array'
      ) {
        check = true;
      }
      if ($.type(data.text) !== 'string') console.error('[souceData.text] type must be string.');
      if ($.type(data.entities) !== 'array') console.error('[souceData.entities] type must be array.');
      if ($.type(data.sentenceOffsets) !== 'array') console.error('[souceData.sentenceOffsets] type must be array.');
      if ($.type(data.relations) !== 'array') console.error('[souceData.relations] type must be array.');
      return check;
    }

    // 外部帶入的欄位型別
    if (checkSouceDataType(settings.souceData)) return null; //強制中斷套件

    var _settings = $.extend(defaultSettings, settings); //外部設定與套件預設合併

    var $this = this,                      // 快取外部套用套件的 DOM 元素用
        $rootArea = null,                  // 快取套件本身最上層 DOM 元素用
        $previewBox = null,                // 快取套件上的預覽標籤資料浮動小區塊介面 DOM 元素用
        $msgBox = null,                    // 快取套件上的刪除有關聯的貼標出現的提示訊息 DOM 元素用
        souceData = null,                  // 紀錄套件需要的資料結構
        cacheTxt = null,                   // 紀錄滑鼠當下圈選的文字用
        cacheWordLength = [],              // 紀錄滑鼠當下圈選的文字在原始文章中的字段索引數
        lineTagOffsetX = 8,                // 關聯線條的頭尾點左右偏移用
        lineTagOffsetY = 6,                // 關聯線條的頭尾點上下偏移用
        lineHeight = 14,                   // 一個關聯'線條'所佔的高度
        $allSpan = [],                     // 快取所有一個一個字元 span 對象用
        $fromDropEntitie = null,           // 紀錄當下拖曳的標籤物件用
        $toDropEntitie = null,             // 紀錄當下拖曳後要關聯的標籤物件用
        mouseUI = {                        // 用來管理滑鼠行為用
          isMouseDownOnEntities: false,    //   判斷是否滑鼠是在標籤上按下狀態
          isMouseDownOnText: false,        //   判斷是否滑鼠是在文章段落上按下狀態
          x: 0,                            //   滑鼠當下 x 座標
          y: 0,                            //   滑鼠當下 y 座標
          isHideEntities: false,           //   是否不呈現貼標的標籤
          isHideRelations: false,          //   是否不呈現關聯標籤
          isHideOneRelation: false,        //   是否為關閉單筆關聯標籤狀態
          stopChoice: false,               //   是否滑鼠停止圈選文字
          deleteEntities: false            //   是否開啟刪除單筆貼標狀態
        },
        globalW = 0,                       // 紀錄貼標工具的寬(注意要扣掉scrollbar的寬這樣的尺寸才安全)
        globalH = 0,                       // 紀錄貼標工具的高
        $ctrlTemplate = '',                // 紀錄套件控制面板的 template html 字串用
        eHeight = 14,                      // 一個關聯標籤+所需佔用的高度
        timesObj = null,                   // 時間監聽物件
    // 套件控制面板 template html 字串
    $ctrlTemplate = (function() {
      return `
        <div class="annotation ctrl-box">
          <button class="explanation-btn">
            <i class="fa fa-question-circle-o" aria-hidden="true"></i>
            貼標顏色說明
            <div class="explanation-view">
              <span class="word entities entitiesStart" data-ent-type="未定義">人工貼標</span>
              <span class="word entities entitiesStart isAiTag" data-ent-type="未定義">智能貼標</span>
              <span class="word entities entitiesStart hasCheckStatus" data-ent-type="未定義">待審核標籤</span>
              <span class="word entities entitiesStart hasRejectStatus" data-ent-type="未定義">暫存標籤</span>
            </div>
          </button>
          <label class="slice">
            <input type="checkbox" name="del" class="ctrl-del" >
            <span>刪除單筆貼標</span>
          </label>
          <label class="slice">
            <input type="checkbox" name="choice" class="ctrl-choice" >
            <span>停止圈選貼標</span>
          </label>
          <label class="slice">
            <input type="checkbox" name="ent" class="ctrl-ent" checked >
            <span>呈現貼標＆拖曳</span>
          </label>
          <label>
            <input type="checkbox" name="rel" class="ctrl-rel" checked >
            <span>呈現關聯標籤</span>
          </label>
          <label>
            <input type="checkbox" name="relone" class="ctrl-relOne" >
            <span>單筆關聯標籤隱藏＆停止編輯</span>
          </label>
          <button type="button" class="ctrl-reDraw">復原隱藏</button>
        </div>
      `;
    }());

    // 整理資料
    function sortSouceData () {
      //標籤: 提醒由於是數字數的概念所以先將, 標籤依照字段由小排到大不然會有bug
      if (souceData.entities) {
        souceData.entities.sort(function (a, b) {
          return a[2][0] - b[2][0];
        });
      }
      //關聯線條: 
      if (souceData.relations) {
        souceData.relations.sort(function (a, b) {
          var aT = parseInt(a[2][0].split('T')[1]),
              bT = parseInt(b[2][0].split('T')[1]);
          return aT - bT;
        });
      }
    }

    // ● 原始文章轉成一個個文章段落 (為了ＲＷＤ)
    function souceDataToText () {
      var calcWord = 0,    //紀錄文字的索引數用
          calcRows = 0,    //紀錄行數的索引數用
          calcWidth = 0,   //計算一個字一個字的寬度加總用
          prevPLength = 0; //記錄上一個段落的字數長度, 提供下一個段落計算用

      if (!souceData.text || souceData.text === '') {
        return false;
      }

      sortSouceData();
      reDrawView();

      //先跑後端定義的段落
      $.each(souceData.sentenceOffsets, function (i, item) {
        calcWidth = 0;
        /* className 預設是 text
          question 是 for 問答知識庫的“問題”
          answer   是 for 問答知識庫的“答案”
        */
        var className = 'text';
        if (item[2] === 'q') className = className+' question';
        if (item[2] === 'a') className = className+' answer';
        if (item[2] === 't') className = className+' title';
        /* 提醒: 這邊藏了一些屬性在 DOM 上面
          text-l 第幾行的意思
          gapcount 代表這一個段落有幾個貼標, 預設為0沒有貼標 
        */
        var $p = $('<p class="' + className + '" text-l="' + (calcRows + i) + '" gapcount="0"></p>');
        // 將該行文字拆解成一個一個span的字元 (方便 jquery select)
        var stringAry = souceData.text.slice(item[0], item[1]).split('');
        $.each(stringAry, function (j, jtem) {
          //找出這個字是否為貼標文字
          var inP = 0; //計算用
          $.each(souceData.entities, function (k, ktem) {
            var S = ktem[2][0];
            if (j + prevPLength === S) {
              inP = inP + 2;
            }
          });
          
          /* 提醒: 這邊藏了屬性在 DOM 上面
            l 第幾個字元的意思
          */
          var spaceWordClass = (jtem === '' || jtem === ' ')? 'space-word' : '', // 是否為空格的class
              $span = $('<span class="word ' + spaceWordClass + '" l="' +  calcWord + '">' + jtem + '</span>');
          $allSpan.push($span); // 快取所有一個一個字元對象
          calcWord++;
          // 假設一個字元的寬度是14px (因為此時還在記憶體中取不到寬度)
          // inP*20 代表的是一個貼標的左右距離各為10px的padding空間
          // inP*6 代表的是一個貼標的第一個跟最後一個字元距離各為3px的padding空間
          calcWidth = (calcWidth + 14) + (inP * 10) + (inP * 3);
          if (calcWidth >= globalW) {
            $rootArea.append($p);
            //$span.css('background-color', 'red'); // 測試用
            calcRows++;
            calcWidth = 0;
            $p = $('<p class="text" text-l="' + (calcRows + i) + '" gapcount="0"></p>');
          }
          $p.append($span);
        });
        $rootArea.append($p);

        prevPLength = prevPLength + stringAry.length; //保存上一個 souceData.sentenceOffsets 段落的字串長度
      });

      souceDataToEntities();
    }

    // ● 將已貼標的標籤呈現出來
    function souceDataToEntities () {
      if (souceData.entities.length > 0) {
        $.each(souceData.entities, function (i, item) {
          var S = item[2][0],
              E = item[2][1],
              isAiTag = item[4], //是否為初始化智能貼標樣式
              rolAry = [],       // 紀錄貼標在哪一個文章段落
              useClass = null,   // 貼標使用的css名稱
              useEntitieName = null,  // 呈現的貼標文字
              hasCheckStatus = false, // 貼標的領域與實體資料中是否有一筆是待審核的 pairing: false
              hasRejectStatus = false; // 貼標的領域與實體資料中是否有一筆是略過的 pairing: null
          //找出是否有待審核的領域與實體
          $.each(item[1], function (j, jtem) {
            if (jtem.pairing === false) {
              hasCheckStatus = true;
            }
            if (jtem.pairing === null) {
              hasRejectStatus = true;
            }
          });

          // 找出文字的 DOM 對象
          for ( var i = S; i <= E-1; i++ ) {
            /* 提醒: 這邊藏了屬性在 DOM 上面
              ent 文字屬於哪一個標籤id
              data-ent-type 標籤屬於哪一種類別
            */
            useClass = (item[1].length === 1)? 'entities' : 'entities multiple'; //當有多個標籤定義時
            // 注意:有css順序權重
            if (hasRejectStatus) {
              useClass += ' hasRejectStatus';
            }
            if (hasCheckStatus) {
              useClass += ' hasCheckStatus';
            }
            useEntitieName = (item[1].length === 1)? item[1][0].code : item[1][0].code+'...'; //當有多個標籤定義時
            
            $($allSpan[i]).addClass(useClass).attr('ent', item[0]).attr('data-ent-type', useEntitieName); //提醒一個字段可以有多個貼標定義,目前固定取第一個呈現.
            // 如果這是該貼標的第一個字元
            if (i === S) {
              var className = 'entitiesStart';
              if (isAiTag) {
                className += ' isAiTag';
              } 
              $($allSpan[i]).addClass(className);
            }
            // 如果這是該貼標的最後一個字元
            if (i === E-1) {
              $($allSpan[i]).addClass('entitiesEnd');
            }
            // 有貼標 gapcount 就固定先給1
            $($allSpan[i]).parent('.text').addClass('hasEntities').attr('gapcount', 1); 
          }
        });
        // 再將標籤範圍給予左右間隔的效果
        $.each(souceData.entities, function (i, item) {
          var entId = item[0];
          //一個個文章段落比對
          $.each($rootArea.find('.text'), function (j, jtem) {
            var $wordRange = $(jtem).find('.word[ent=' + entId + ']');
            if ($($wordRange[0]).prevAll('.word').length) { //不是該段落的第一個字元才要在前面放一個間隔
              $($wordRange[0]).before('<span class="entitiesGap"></span>');
            }
            $($wordRange[($wordRange.length-1)]).after('<span class="entitiesGap"></span>');
          });
        });
        globalH = parseInt($rootArea.height(), 10);
      }
      souceDataToRelations();
    }

    // ● 將已關聯標籤線條與點點呈現出來
    function souceDataToRelations () {
      if (souceData.relations.length > 0) {
        
        // 第一次先依照貼標數量,處理段落高度
        $.each(souceData.relations, function (i, item) {
          var fomeId = item[2][0], // 紀錄起始點的 id
              toId = item[2][1],   // 紀錄結束點的 id
              $fromSpan = null,    // 紀錄起始點的 span
              $toSpan = null,      // 紀錄結束點的 span
              $fromText = null,    // 紀錄起始點所在的段落
              $toText = null;      // 紀錄結束點所在的段落

          //jquery select 出頭尾標籤的 span
          $.each($allSpan, function (j, jtem) {
            if (jtem.attr('ent') === fomeId) {
              if ($fromSpan === null) {
                $fromSpan = jtem;
              }
            }
            if(jtem.attr('ent') === toId) {
              if ($toSpan === null) {
                $toSpan = jtem;
              }
            }
          });

          //jquery select 出頭尾標籤所在的段落
          $fromText = $fromSpan.parent('.text');
          $toText = $toSpan.parent('.text');

          // ●● 步驟1 找出頭尾點所在的段落,用以判斷段落要長多高 start
          // 取得頭尾段落個別是第幾行
          var fromTextlength = parseInt($fromText.attr('text-l'), 10),
              toTextlength = parseInt($toText.attr('text-l'), 10),
              $rangeText = null; // 紀錄跨了幾個段落DOM用
          
          // 頭尾標籤是否在同一個段落後
          if (fromTextlength === toTextlength) { //同段落
            $rangeText = $rootArea.find('.text').slice(fromTextlength, toTextlength+1);
          } 
          if (fromTextlength !== toTextlength) { //不同段落
            //判斷頭尾行是往前行數還往後行數
            if (fromTextlength < toTextlength) { //往後找
              $rangeText = $rootArea.find('.text').slice(fromTextlength, toTextlength+1);
            } 
            if (fromTextlength > toTextlength) { //往前找
              $rangeText = $rootArea.find('.text').slice(toTextlength, fromTextlength+1);
            } 
          }
          
          // 依照eCount決定段落要長多高
          $.each($rangeText, function (j, jtem) {
            var $jtem = $(jtem),
                eCount = parseInt($jtem.attr('gapcount'), 10) + 1; //加1
            if (j === 0 || j === $rangeText.length-1) { //只長高頭尾, 如果中間幾層也要長高就拿掉此判斷
              $jtem.css('padding-top', ((eCount * eHeight) + eHeight + 'px'));
              $jtem.attr('gapcount', eCount); //加1後寫回去attribute
              //提醒: 這邊在偷偷加工將關聯的 id 帶到 has-relations 這上面來記錄 (讓第三次回圈用)
              var hasRelations = $jtem.attr('has-relations');
              if (hasRelations) {
                hasRelations = hasRelations + ',' + item[0];
              } else {
                hasRelations = item[0];
              }
              $jtem.attr('has-relations', hasRelations);
            }
          });
          // ●● 步驟1 找出頭尾點所在的段落,用以判斷段落要長多高 end
        });
      
        // 第二次處理頭尾點點
        $.each(souceData.relations, function (i, item) {
          var fomeId = item[2][0], // 紀錄起始點的 id
              toId = item[2][1],   // 紀錄結束點的 id
              $fromSpan = null,    // 紀錄起始點的 span
              $toSpan = null;      // 紀錄結束點的 span

          //jquery select 出頭尾標籤的 span
          $.each($allSpan, function (j, jtem) {
            if (jtem.attr('ent') === fomeId) {
              if ($fromSpan === null) {
                $fromSpan = jtem;
              }
            }
            if(jtem.attr('ent') === toId) {
              if ($toSpan === null) {
                $toSpan = jtem;
              }
            }
          });

          // ●● 步驟2 先標出頭尾點點 start
          // 注意這邊是透過 js 取得 css 的偽元素的寬跟高
          var tagS = { x: 0, y: 0 }, // from 標籤的點點座標
              tagE = { x: 0, y: 0 }, // from 標籤的點點座標
              $mockS = window.getComputedStyle($fromSpan[0], ":before"), // from 偽元素
              $mockE = window.getComputedStyle($toSpan[0], ":before"),   // to 偽元素
              arrow = null, // 紀錄結束的點點箭頭要向左還是向右的 css 名稱
              $divTmp1 = $('<div/>').addClass('relationLinePoint'), // 提供頭點點 DOM 用
              $divTmp2 = $('<div/>').addClass('relationLinePoint'); // 提供尾點點 DOM 用

          // 偽元素內距
          tagS.x = tagS.x + parseFloat($mockS.getPropertyValue("padding-left")) + parseFloat($mockS.getPropertyValue("padding-right")) / 2;
          tagE.x = tagE.x + parseFloat($mockE.getPropertyValue("padding-left")) + parseFloat($mockE.getPropertyValue("padding-right")) / 2;
          
          // 偽元素寬度
          tagS.x = tagS.x + parseFloat($mockS.getPropertyValue("width")) / 2;
          tagE.x = tagE.x + parseFloat($mockE.getPropertyValue("width")) / 2;

          // 偽元素線條寬度
          tagS.x = tagS.x + parseFloat($mockS.getPropertyValue("border-left-width"));
          tagS.x = tagS.x + parseFloat($mockS.getPropertyValue("border-right-width"));
          tagE.x = tagE.x + parseFloat($mockE.getPropertyValue("border-left-width"));
          tagE.x = tagE.x + parseFloat($mockE.getPropertyValue("border-right-width"));
          
          // 該 span 在 $rootArea 的 x 相對座標
          tagS.x = tagS.x + parseFloat($fromSpan[0].offsetLeft) - lineTagOffsetX; //頭點往左偏移
          tagE.x = tagE.x + parseFloat($toSpan[0].offsetLeft) + lineTagOffsetX;   //尾點往右偏移

          // 該 span 在 $rootArea 的 y 相對座標
          tagS.y = parseFloat($fromSpan[0].offsetTop) + 
                  parseFloat($fromSpan.parent()[0].offsetTop) +
                  parseFloat($mockS.getPropertyValue("top"))/2 - 
                  parseFloat($mockS.getPropertyValue("height"));
          tagE.y = parseFloat($toSpan[0].offsetTop) + 
                  parseFloat($toSpan.parent()[0].offsetTop) +
                  parseFloat($mockS.getPropertyValue("top"))/2 -
                  parseFloat($mockS.getPropertyValue("height"));

          // 判斷結束的點點箭頭要向左還是向右的 css 名稱
          arrow = (parseInt($fromSpan.attr('l'), 10) > parseInt($toSpan.attr('l'), 10))? 'left' : 'right';

          /* 提醒: 這邊藏了屬性在 DOM 上面
            r-id 關聯id (方便第三次迴圈處理用)
            f-id 從哪個標籤開始關聯的id
            t-id 到哪個標籤結束關聯的id
            tag-x 該點的x座標 (方便第三次迴圈判斷線條是否要長高用)
            tag-y 該點的y座標 (方便第三次迴圈判斷線條是否要長高用)
          */
          //頭點點
          $divTmp1.attr({ 
            'r-id': item[0], 
            'f-id': fomeId, // 標籤開始關聯的id
            'tag-x': tagS.x,
            'tag-y': tagS.y
          });
          $divTmp1.css({ left: tagS.x, top: tagS.y });
          //尾點點
          $divTmp2.addClass('arrow');
          $divTmp2.addClass('end');
          $divTmp2.attr({ 
            'r-id': item[0], 
            't-id': toId, // 標籤結束關聯的id
            'tag-x': tagE.x,
            'tag-y': tagE.y
          });
          $divTmp2.css({ left: tagE.x, top: tagE.y });
          $rootArea.append([$divTmp1, $divTmp2]);
          // ●● 步驟2 先標出頭尾點點 end
        });

        // 第三次處理頭尾點點相連線條
        var $relationLineAry = [];
        $.each(souceData.relations, function (i, item) {
          var fomeId = item[2][0], // 紀錄起始點的 id
              toId = item[2][1],   // 紀錄結束點的 id
              $fromSpan = null,    // 紀錄起始點的 span
              $toSpan = null,      // 紀錄結束點的 span
              $fromText = null,    // 紀錄起始點所在的段落
              $toText = null;      // 紀錄結束點所在的段落
          
          // jquery select 出頭尾標籤的span
          $.each($allSpan, function (j, jtem) {
            if (jtem.attr('ent') === fomeId) {
              if ($fromSpan === null) {
                $fromSpan = jtem;
              }
            }
            if(jtem.attr('ent') === toId) {
              if ($toSpan === null) {
                $toSpan = jtem;
              }
            }
          });

          // jquery select 出頭尾標籤所在的段落
          $fromText = $fromSpan.parent('.text'); // 從哪個段落
          $toText = $toSpan.parent('.text');     // 到哪個段落

          // ●● 步驟3 在將兩個點相連 start
          // 取得頭尾段落個別是第幾行
          var fromTextlength = parseInt($fromText.attr('text-l'), 10),
              toTextlength = parseInt($toText.attr('text-l'), 10);

          // 取得頭尾點的相對座標
          var $point = $('.relationLinePoint[r-id=' + item[0] + ']'), // jQuery select 頭尾的兩個點點 DOM
              fromX = parseFloat($($point[0]).css('left')) + 2, // 2是點點的一半寬度,再扣掉線條1px的意思
              toX = parseFloat($($point[1]).css('left')) + 2,
              fromY = parseFloat($($point[0]).css('top')) - lineTagOffsetY, 
              toY = parseFloat($($point[1]).css('top')) - lineTagOffsetY,
              calcW = 0,              // 計算線段的寬度用
              calcH = lineTagOffsetY, // 計算線段的高度用
              calcX = 0,              // 紀錄要使用哪一點X座標當作線條的座標
              calcY = 0,              // 紀錄要使用哪一點Ｙ座標當作線條的座標
              classLRT = '';          // 紀錄要使用左邊的線條,還是右邊的線條
              $relationLine = $('<div/>');
          
          // 線條基本設定
          $relationLine.addClass('relationLine');
          $relationLine.attr({
            'id': item[0],  // 為了等一下修改偽元素的高度用
            'r-id': item[0]
          });

          // 跟偷偷藏在 .text 上面的 id 做比對, 看是屬於第幾筆就乘以高度
          var hasRelationsForFrom = $fromText.attr('has-relations').split(','),
              hasRelationsForTo = $toText.attr('has-relations').split(','),
              calcIndex = null; // 紀錄要長多高的索引數

          // 同段落
          if (fromTextlength === toTextlength) {
            // 找出要長多高的索引數 (用from找)
            $.each(hasRelationsForFrom, function (j, jtem) {
              if (jtem === item[0]) {
                calcIndex = j;
              }
            });
            calcY = fromY;
            // 判斷線段是要從左到右連,還是右到左.
            if (fromX < toX) { // 左 > 右
              calcW = toX - fromX;
              calcX = fromX;
            } else {
              calcW = fromX - toX;
              calcX = fromX - calcW; // 處理往左的偏移
            }
            calcY = calcY - (calcIndex * lineHeight);
            calcH = calcH + (calcIndex * lineHeight);
            //console.log('同段落 calcH:' + calcH);
            $relationLine.css({
              width: calcW,
              height: calcH,
              left: calcX,
              top: calcY
            });
          } 

          // 不同段落
          if (fromTextlength !== toTextlength) {
            // 找出要長多高的索引數 (用to找)
            $.each(hasRelationsForTo, function (j, jtem) {
              if (jtem === item[0]) {
                calcIndex = j;
              }
            });
            //判斷線段是要從 左到右, 右到左, 上到下, 下到上
            calcW = Math.abs(fromX - toX);
            calcH = Math.abs(fromY - toY) + lineTagOffsetY;
            if (fromX < toX && fromY < toY) { // 左-右, 上-下
              calcY = fromY; //上-下固定用 fromY;
              calcX = fromX;
              classLRT = 'LRtoBottom';
            }
            if (fromX > toX && fromY < toY) { // 右-左, 上-下
              calcY = fromY; //上-下固定用 fromY;
              calcX = fromX - calcW; //處理往左的偏移
              classLRT = 'RLtoBottom';
            }
            if (fromX < toX && fromY > toY) { // 左-右, 下-上
              calcY = toY; //下-上固定用 toY
              calcX = fromX;
              classLRT = 'LRtoTop';
            }
            if (fromX > toX && fromY > toY) { // 右-左, 下-上
              calcY = toY; //下-上固定用 toY
              calcX = fromX - calcW; //處理往左的偏移
              classLRT = 'RLtoTop';
            }
            calcY = calcY - (calcIndex * lineHeight);
            calcH = calcH + (calcIndex * lineHeight);
            //console.log('不同段落 calcH:' + calcH);
            $relationLine.addClass(classLRT);
            $relationLine.css({
              width: calcW,
              height: calcH,
              left: calcX,
              top: calcY
            });
          }

          // 接續處理 偽元素 的高度樣式 (+3 大約是頭尾點點的高度一半)
          var newStyle = `<style type='text/css'>  
            #${item[0]}.relationLine.LRtoBottom::before,
            #${item[0]}.relationLine.RLtoTop::before,
            #${item[0]}.relationLine.RLtoBottom::before,
            #${item[0]}.relationLine.LRtoTop::before {
              height: ${(calcIndex * lineHeight) + 3}px;
            }
          </style>`;
          newStyle = $(newStyle);
          $relationLine.append(newStyle);
          $relationLine.append('<span>' + item[1].name + '</span>');
          $relationLineAry.push($relationLine);
          $rootArea.append($relationLineAry);
          // ●● 步驟3 在將兩個點相連 end
        });
      }
      $rootArea.addClass('rendered'); //給予當作渲染完畢的calss
    }

    // 找出屬於同一個標籤的 span 方法
    function findSameSpan ($event, _where) {
      var $re = $('<div/>'),
          ent = $event.attr('ent'),
          entString = '',
          $getSpan = $rootArea.find('.word[ent=' + ent + ']'),
          where = (_where === 'from')? 'fromDropEntitie' : 'toDropEntitie'; //注意:對應的是前端定義拖曳標籤的 id

      $.each($getSpan, function (i, item) {
        entString = entString + $(item).text();
      });

      $re.attr({
        id: where,
        ent: ent
      });
      $re.text(entString);

      return $re;
    }

    // 找出某一個標籤資料的方法
    function findEntitieData (entitieID) {
      var re;
      $.each(souceData.entities, function (i, item) {
        if (item[0] === entitieID) {
          re = item;  
        }
      });
      return re;
    }

    // 滑鼠行為結束後的 ui 變數重置
    function resetUi () {
      $('#fromDropEntitie').remove();
      $fromDropEntitie = null;
      $toDropEntitie = null;
      mouseUI.isMouseDownOnText = false;
      mouseUI.isMouseDownOnEntities = false;
      mouseUI.x = 0;
      mouseUI.y = 0;
      cacheTxt = null;
      cacheWordLength = [];
    }

    // 資料更新從新初始化繪圖介面
    function reDrawView () {
      $rootArea.removeClass('rendered');
      $allSpan = [];
      $rootArea.html('');
      $rootArea.append($ctrlTemplate);
      $rootArea.append('<ul class="preview-box"></ul>');
      $rootArea.append('<div class="msgBox">無法刪除,因為還有關聯其他貼標</div>');
      $previewBox = $rootArea.find('.preview-box');
      $msgBox = $rootArea.find('.msgBox');
      $rootArea.find('.ctrl-ent').attr('checked', !mouseUI.isHideEntities);
      $rootArea.find('.ctrl-rel').attr('checked', !mouseUI.isHideRelations);
      $rootArea.find('.ctrl-relOne').attr('checked', mouseUI.isHideOneRelation);
      $rootArea.find('.ctrl-choice').attr('checked', mouseUI.stopChoice);
      $rootArea.find('.ctrl-del').attr('checked', mouseUI.deleteEntities);

      //判斷DOM是否渲染完畢
      clearInterval(timesObj);
      timesObj = null;
      timesObj = setInterval(() => {
        if ($rootArea.hasClass('rendered')) { 
          clearInterval(timesObj);
          timesObj = null;
          //通知外部已經渲染完畢
          if (typeof _settings.drawDone === 'function') {
            _settings.drawDone(true);
          }
        }
      }, 1000);
    }

    /* 去掉頭尾選到空格的文字方法
      _StartLength [Number]  從哪一個文字字斷找起
      _where       [String]  往前還是往後找 'next' or 'prev'
    */
    function trimSpaceWord (_StartLength, _where) {
      var txt = null, 
          length = _StartLength;

      txt = souceData.text.slice(_StartLength, _StartLength + 1); //提醒:js的slice是依照長度所以要+1

      // 如果為空字串就在找一次
      if (txt === ' ') {
        length = (_where === 'next')? _StartLength + 1 : _StartLength - 1;
        return trimSpaceWord(length, _where);
      }

      return {
        txt: txt,
        length: length
      };
    }

    // 提供給套件外部取得當下資料用
    function getData () {
      return souceData;
    }

    // 提供給套件外部設定當下資料用
    function setData (_data) {
      // 檢查套件必須要有的資料結構
      if (!('text' in _data)) {
        _data.text = '';
      }
      if (!('entities' in _data)) {
        _data.entities = [];
      }
      if (!('text' in _data)) {
        _data.text = '';
      }
      if (!('sentenceOffsets' in _data)) {
        _data.sentenceOffsets = [[0, _data.text.length]];
      }
      if (!('relations' in _data)) {
        _data.relations = [];
      }
      // 檢查資料型別
      if (checkSouceDataType(_data)) {
        return null;
      }
      souceData = _data;
      souceDataToText();
    }

    // 提供外部破壞套件的方法
    function destroy () {
      resetUi();
      $this.html('');
      //移除時間監聽物件
      clearInterval(timesObj);
      timesObj = null;
      return null;
    }

    // [E] 套件初始化完成後統一綁定事件方法
    function bindEvent () {
      // [E] 滑鼠移入已貼標的 span
      $rootArea.on('mouseover, mouseenter', '.entities', function (event) {
        var useEntities = $(event.target).attr('ent'), // 找出該文字屬於哪一個標籤
            $groupSpan = $rootArea.find('.word[ent=' + useEntities + ']'),
            $parentText = $($groupSpan[0]).parent('.text');
        $groupSpan.addClass('hover');
        if (!mouseUI.isMouseDownOnText) {
          var removeItem = findEntitieData (useEntities),
              listHtml = '',
              X = $groupSpan[0].offsetLeft,
              Y = $parentText[0].offsetTop + parseInt($parentText.height(), 10) + parseInt($parentText.css('padding-top'), 10),
              L = 'auto',
              R = 'auto',
              T = 'auto';
          $.each(removeItem[1], function(i, item) {
            var showName = (removeItem[5] === 'relation') ? '關聯' : '實體'
            var endTag = (removeItem[5] === 'relation') ? ' ｜ ' + '實體: ' + item.entityCode + '</li>' : '</li>'
            listHtml += '<li>領域: ' + item.domain + ' ｜ ' + showName + ': ' + item.code + endTag;
          });
          $previewBox.html(listHtml).addClass('show'); //要先呈現不然取不到高度跟寬度
          //檢查座標 左右
          if ((X + $previewBox.width()) > globalW) {
            R = 0;
          } else {
            L = X;
          }
          //檢查座標 上下
          if ((Y + $previewBox.height()) > globalH) {
            T = Y - $previewBox.height() - (eHeight * 3);
          } else {
            T = Y;
          }
          $previewBox.css({top: T, right: R, left: L});
        }
      });
      // [E] 滑鼠移出已貼標的 span
      $rootArea.on('mouseout, mouseleave', '.entities', function (event) {
        var useEntities = $(event.target).attr('ent'), // 找出該文字屬於哪一個標籤
            $groupSpan = $rootArea.find('.word[ent=' + useEntities + ']');
        $groupSpan.removeClass('hover');
        $previewBox.html('').removeClass('show').removeAttr('style');
      });
      // [E] 滑鼠按住已貼標的 span
      $rootArea.on('mousedown', '.entities', function (event) {
        if (!mouseUI.isHideEntities) {
          resetUi();
          mouseUI.isMouseDownOnEntities = true;
          $fromDropEntitie = findSameSpan($(event.target), 'from');
          $rootArea.append($fromDropEntitie);
        }
      });
      // [E] 滑鼠放開已貼標的 span
      $rootArea.on('mouseup', '.entities', function (event) {
        if (!$fromDropEntitie) { //如果滑鼠是從一般文字按下就不會有 $fromDropEntitie
          resetUi();
          return false;
        }
        $toDropEntitie  = findSameSpan($(event.target), 'from');
        var fromId = $fromDropEntitie.attr('ent'),
            toId = $toDropEntitie.attr('ent'),
            fromAry = null,
            toAry = null;
        resetUi();
        // 判斷是否從別的標籤過來的
        if (fromId !== toId) {
          // 判斷是否已經關聯了
          var isHave = false;
          $.each(souceData.relations, function (i, item) {
            if (item[0] === fromId+toId) isHave = true;
          });
          if (!isHave) {
            // 取得記錄在 souceData.entities 中的字數索引資料 (for後端資料庫要用)
            $.each(souceData.entities, function (i, item) {
              if (item[0] === fromId) {
                fromAry = item[2];
              }
              if (item[0] === toId) {
                toAry = item[2];
              }
            });
            // 建立關聯標籤資料 TODO... 這邊的 {name:'link', code:'9999'} 資料還未正式定案, 之後在跟後端討論
            var newOneData = [fromId+toId, {name:'link', code:'9999'}, [fromId, toId], [fromAry, toAry]];
            souceData.relations.push(newOneData);
            _settings.callback(newOneData, souceData, 'addRelation'); // 返回給套件外部
            souceDataToText();
          }
        }
      });
      // [E] 滑鼠點兩下已貼標的 span
      $rootArea.on('dblclick', '.entities', function (event) {
        var checkVal = $(event.target).attr('ent');
        $.each(souceData.entities, function (i, item) {
          if (item[0] === checkVal) {
            _settings.editEntities(item); //回給外部該筆資料
          }
        });
      });
      // [E] 滑鼠點一下刪除已貼標的 span
      $rootArea.on('click', '.entities', function (event) {
        if (mouseUI.deleteEntities) {
          var checkVal = $(event.target).attr('ent'),
              isRelation = false,
              selectIndex,
              offsetTop = $rootArea.offset().top,
              $ctrlBox = $('.ctrl-box'),
              h = parseInt($ctrlBox.height(), 10) + parseInt($ctrlBox.css('padding-top'), 10) + parseInt($ctrlBox.css('padding-bottom'), 10),
              msgPositionHeight = 80;

          $.each(souceData.entities, function (i, item) {
            if (item[0] === checkVal) {
              selectIndex = i;  
            }
          });
          $.each(souceData.relations, function(i, item) {
            if (item[0].indexOf(checkVal) !== -1) {
              isRelation = true;
            }
          })
          if (isRelation) {
            if (offsetTop < 0) {
              msgPositionHeight = h + Math.abs(offsetTop);
            }
            $msgBox.css('top', msgPositionHeight);
            $msgBox.addClass('show');
            setTimeout(function() {
              $msgBox.removeClass('show');
            }, 2000);
            return false;
          }
          var removeItem = souceData.entities[selectIndex];
          souceData.entities.splice(selectIndex, 1);
          _settings.callback(removeItem, souceData, 'deleteEntity'); // 返回給套件外部
          souceDataToText();
        }
      });

      // [E] 滑鼠移入已關聯線條的類別標籤上
      $rootArea.on('mouseover, mouseenter', '.relationLine span', function (event) {
        var rId = $(event.target).parent().attr('r-id');
        $rootArea.find('.relationLinePoint[r-id=' + rId + ']').addClass('hover');
        $rootArea.find('.relationLine[r-id=' + rId + ']').addClass('hover');
      });
      // [E] 滑鼠移出已關聯線條的類別標籤上
      $rootArea.on('mouseout, mouseleave', '.relationLine span', function (event) {
        var rId = $(event.target).parent().attr('r-id');
        $rootArea.find('.relationLinePoint[r-id=' + rId + ']').removeClass('hover');
        $rootArea.find('.relationLine[r-id=' + rId + ']').removeClass('hover');
      });
      // [E] 滑鼠移入已關聯線條的點點上
      $rootArea.on('mouseover, mouseenter', '.relationLinePoint', function (event) {
        var rId = $(event.target).attr('r-id');
        $rootArea.find('.relationLinePoint[r-id=' + rId + ']').addClass('hover');
        $rootArea.find('.relationLine[r-id=' + rId + ']').addClass('hover');
      });
      // [E] 滑鼠移出已關聯線條的點點上
      $rootArea.on('mouseout, mouseleave', '.relationLinePoint', function (event) {
        var rId = $(event.target).attr('r-id');
        $rootArea.find('.relationLinePoint[r-id=' + rId + ']').removeClass('hover');
        $rootArea.find('.relationLine[r-id=' + rId + ']').removeClass('hover');
      });
      // [E] 滑鼠點一下已關聯線條的點點上
      $rootArea.on('click', '.relationLinePoint', function (event) {
        var checkVal = $(event.target).attr('r-id');
        //是否為單筆關聯標籤影藏的狀態
        if (mouseUI.isHideOneRelation) {
          $('.relationLine[r-id=' + checkVal + ']').toggleClass('hide');
          $('.relationLinePoint[r-id=' + checkVal + ']').toggleClass('hide');
          return false;
        }
      });
      // [E] 滑鼠點一下已關聯線條的類別標籤
      $rootArea.on('click', '.relationLine span', function (event) {
        var $target = $(event.target),
            checkVal = $target.parent().attr('r-id');
        //是否為單筆關聯標籤影藏的狀態
        if (mouseUI.isHideOneRelation) {
          $target.parent('.relationLine').toggleClass('hide');
          $('.relationLinePoint[r-id=' + checkVal + ']').toggleClass('hide');
          return false;
        }
      });
      // [E] 滑鼠點兩下已關聯線條的類別標籤
      $rootArea.on('dblclick', '.relationLine span', function (event) {
        var $target = $(event.target),
            checkVal = $target.parent().attr('r-id');
        //是否為單筆關聯標籤影藏的狀態
        if (mouseUI.isHideOneRelation) {
          return false;
        }
        $.each(souceData.relations, function (i, item) {
          if (item[0] === checkVal) {
            _settings.editRelations(item); //回給外部該筆資料
          }
        });
      });

      // [E] 滑鼠在文字按住
      $rootArea.on('mousedown', '.word', function (event) {
        if (!mouseUI.stopChoice) {
          cacheWordLength = [];
          mouseUI.isMouseDownOnText = true;
          cacheWordLength.push(parseInt($(event.target).attr('l'))); //紀錄按下時的文字字斷數
        }
      });
      // [E] 滑鼠在文字放開
      $rootArea.on('mouseup', '.word', function (event) {
        var sWord, eWord, newOneData;
        //按下一般文字並且不是拖曳標籤狀態
        if (mouseUI.isMouseDownOnText && !mouseUI.isMouseDownOnEntities) {
          cacheWordLength.push(parseInt($(event.target).attr('l'))); //紀錄放開時的文字字斷數

          //如果是從文字後面往前圈選
          if (cacheWordLength[0] > cacheWordLength[1]) {
            cacheWordLength = cacheWordLength.reverse();
          }

          cacheTxt = $.trim(souceData.text.slice(cacheWordLength[0], cacheWordLength[1]+1));
          
          //如果只有選到一個空白文字
          if (cacheTxt === ' ' || cacheTxt === '') {
            mouseUI.isMouseDownOnText = false;
            cacheWordLength = [];
            return false;
          }

          //找出頭尾去掉空白後的起訖文字字斷索引數
          sWord = trimSpaceWord(cacheWordLength[0], 'next'),
          eWord = trimSpaceWord(cacheWordLength[1], 'prev');
          cacheWordLength[0] = sWord.length;
          cacheWordLength[1] = eWord.length + 1; //再加１是因為js的slice不像array是索引數而是長度
          //建立標籤資料
          if (_settings.type === 'entity') {
            newOneData = [`T${cacheWordLength[0]}${cacheWordLength[1]}`, [{code:'misc', domain: 'general'}], cacheWordLength, cacheTxt];
            souceData.entities.push(newOneData);
          } else {
            if (souceData.entities.length === 0) {
              newOneData = [`T${cacheWordLength[0]}${cacheWordLength[1]}`, [{code:'misc', domain: 'general'}], cacheWordLength, cacheTxt];
              souceData.entities.unshift(newOneData);
            } else if (souceData.entities[0][5] === 'relation') {
              newOneData = [`T${cacheWordLength[0]}${cacheWordLength[1]}`, [{code:'misc', domain: 'general'}], cacheWordLength, cacheTxt];
              souceData.entities.unshift(newOneData);
            } else {
              newOneData = [`T${cacheWordLength[0]}${cacheWordLength[1]}`, [{code:'IN_CATEGORY', domain: 'general', entityCode: 'misc', pairing: true, status: 0}], cacheWordLength, cacheTxt];
              souceData.entities.push(newOneData);
            }
          }
          _settings.callback(newOneData, souceData, 'addEntity'); // 返回給套件外部
          souceDataToText();
        }
        mouseUI.isMouseDownOnText = false;
        cacheWordLength = [];
      });
 
      // [E] 整個範圍滑鼠行為
      $rootArea.mouseup(resetUi);
      $rootArea.mouseleave(resetUi);
      $rootArea.mousemove(function (event) {
        mouseUI.x = event.pageX - window.scrollX + 5; //+5是避免遮到滑鼠
        mouseUI.y = event.pageY - window.scrollY + 5; //+5是避免遮到滑鼠
        if (mouseUI.isMouseDownOnText) {
          // 代表正在拖曳一個標籤
          if (mouseUI.isMouseDownOnEntities) {
            $fromDropEntitie.css('display', 'block');
            $fromDropEntitie.css('left', mouseUI.x);
            $fromDropEntitie.css('top', mouseUI.y);
          }
          // 代表正在圈選文字
          if (!mouseUI.isMouseDownOnEntities) {
            var S = cacheWordLength[0],
                E = parseInt($(event.target).attr('l')),
                range = [S, E];
            range.sort(function (a, b) {
              return a - b
            });
            //呈現出圈選的視覺效果
            $.each($allSpan, function (i, item) {
              if (i >= range[0] && i <= range[1]) {
                $(item).addClass('user-select');
              } else {
                $(item).removeClass('user-select');
              }
            });
          }
        }
      });

      // [E] window resize
      function resize() {
        // 如果DOM不在了就解除事件註冊
        if (!$('.annotation.rootArea').length) {
          $(window).off('resize', resize);

          clearInterval(timesObj);
          timesObj = null;

          return false;
        }
        globalW = parseInt($rootArea.width(), 10) - 15;
        globalH = parseInt($rootArea.height(), 10);
        souceDataToText();
      }
      $(window).on('resize', resize);

      // [E] 管理介面中的貼標控制項切換
      $rootArea.on('change', '.ctrl-ent, .ctrl-rel, .ctrl-relOne, .ctrl-choice, .ctrl-del', function (event) {
        var who = $(event.target).attr('class');
        if (who === 'ctrl-ent') { // 貼標控制項
          $rootArea.toggleClass('hide-entities');
          mouseUI.isHideEntities = !event.target.checked;
        }
        if (who === 'ctrl-rel') { // 關聯標籤控制項
          $rootArea.toggleClass('hide-relations');
          mouseUI.isHideRelations = !event.target.checked;
        }
        if (who === 'ctrl-relOne') { // 單筆關聯標籤隱藏
          mouseUI.isHideOneRelation = event.target.checked;
        }
        if (who === 'ctrl-choice') { // 停止圈選貼標
          mouseUI.stopChoice = event.target.checked;
          $rootArea.toggleClass('stop-user-select');
        }
        if (who === 'ctrl-del') { // 刪除單筆貼標
          mouseUI.deleteEntities = event.target.checked;
        }
      });
      // [E] 管理介面中的重整按鈕
      $rootArea.on('click', '.ctrl-reDraw', function (event) {
        souceDataToText();
      }); 
    }

    function init () {
      clearInterval(timesObj);
      timesObj = null;
      $rootArea = $('<div/>');
      $rootArea.addClass('annotation');
      $rootArea.addClass('rootArea');
      $rootArea.addClass('stop-user-select');
      $rootArea.append($ctrlTemplate);
      $rootArea.append('<ul class="preview-box"></ul>');
      $rootArea.append('<div class="msgBox">無法刪除,因為還有關聯其他貼標</div>');
      $this.append($rootArea);
      $previewBox = $rootArea.find('.preview-box');
      $msgBox = $rootArea.find('.msgBox');
      globalW = parseInt($rootArea.width(), 10) - 15;
      globalH = parseInt($rootArea.height(), 10);
      bindEvent();
      souceData = _settings.souceData;
      souceDataToText();
    }
    init();

    // 設定提供給外部方法
    this.getSouceData = getData;
    this.setSouceData = setData;
    this.destroy = destroy;
    return this;
  }  
})(jQuery);