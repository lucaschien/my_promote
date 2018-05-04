//^^這是我自己寫的scrollbar套件喔  支援ie9, firefox, chrome, macbook觸控面板
(function ($) {

  //預設值(此時只是區域變數不屬於myScrollbar的屬性)
  var defalutOptions = {
    _ishide: false,  //要不要滑鼠移除範圍就隱藏scrollbar
    _scrollVal: 40   //每一個次滑鼠滾輪可以捲動的高度
  };

  $.fn.myScrollbar = function (options) {

    // 更改預設值
    var options = $.extend({}, defalutOptions, options);

    // plugin實作
    return this.each(function () {

      var _ishide = options._ishide,
          _scrollVal = options._scrollVal;

      //初始化dom對象
      var sroll_area = $(this),
          sroll_body = $(this).find(".sroll_body"),
          bar_area = $(this).find(".bar_area"),
          bar = $(this).find(".bar");

      //私有變數
      var minY = 0,                                                                      //最小滾動高度
          maxY = parseInt(sroll_area.height(), 10) - parseInt(sroll_body.height(), 10),  //最大滾動高度
          scrollVal = _scrollVal,                                                        //每一個次滑鼠滾輪可以捲動的高度
          nowTop = parseInt(sroll_body.css("top"), 10),                                  //記錄目前的top
          percentTOpx = 0;                                                               //將內容捲動的百分比轉換成bar的top像

      //私有變數: 依照內容物百分比換算bar的高度
      var getBarHeight = parseInt(sroll_area.height(), 10) / parseInt(sroll_body.height(), 10);
      getBarHeight = Math.floor(getBarHeight * parseInt(sroll_area.height(), 10));
      bar.height(getBarHeight);

      //私有變數: 取得bar最多可以移動的top
      var maxTop = Math.ceil((maxY / maxY) * 100) * ((parseInt(bar_area.height(), 10) - parseInt(bar.height(), 10)) / 100);

      //私有變數: 觸控用
      var TouchY = [];
          TouchInterval = null,
          touches = {},           //window8 觸控專用
          changedTouches = {};    //window8 觸控專用


      //私有方法: 一段時間就藏起來scrollbar方法
      function _ishide_fn() {
        sroll_area.hover(function () {
          bar_area.stop(true, true);
          bar_area.fadeIn("slow");
        }, function () {
          bar_area.stop(true, true);
          bar_area.fadeOut("slow");
        })
      }

      //私有方法: 改變瀏覽器尺寸的時候從新給予變數
      function _resize_fn() {

        //初始化變數
        minY = 0, //最小滾動高度
        maxY = parseInt(sroll_area.height(), 10) - parseInt(sroll_body.height(), 10),  //最大滾動高度
        scrollVal = _scrollVal, //每一個次滑鼠滾輪可以捲動的高度
        nowTop = parseInt(sroll_body.css("top"), 10), //記錄目前的top
        percentTOpx = 0; //將內容捲動的百分比轉換成bar的top像素

        //依照內容物百分比換算bar的高度
        getBarHeight = parseInt(sroll_area.height(), 10) / parseInt(sroll_body.height(), 10);
        getBarHeight = Math.floor(getBarHeight * parseInt(sroll_area.height(), 10));
        bar.height(getBarHeight);

        //取得bar最多可以移動的top
        maxTop = Math.ceil((maxY / maxY) * 100) * ((parseInt(bar_area.height(), 10) - parseInt(bar.height(), 10)) / 100);

      }
      _resize_fn();

      //私有方法: 讓瀏覽器改變尺寸不會互相影響其他function
      function _startResize() {
        $(window).resize(_resize_fn);
      }
      _startResize();

      //各種事件註冊
      //●滑鼠拖曳bar
      //滑鼠按下
      bar.unbind("mousedown");
      bar.mousedown(function (event) {
        event.preventDefault();//取消瀏覽器默認行為
        $(document).disableSelection();
        percentTOpx = parseInt(bar.css("top"), 10);

        //滑鼠移動
        sroll_area.mousemove(function (event) {

          //處理bar位置
          var y = event.pageY - this.offsetTop - (bar.height() / 2); //區塊座標
          if (y < 0) y = 0;           //限制bar拖曳範圍
          if (y > maxTop) y = maxTop; //限制bar拖曳範圍
          bar.css("top", y);

          //換算內容區塊的位置
          nowTop = Math.ceil((y / maxTop) * 100) * ((parseInt(sroll_area.height(), 10) - parseInt(sroll_body.height(), 10)) / 100);
          sroll_body.css("top", nowTop);
        });

        //滑鼠離開範圍
        sroll_area.mouseleave(function () {
          sroll_area.unbind("mousemove");
          sroll_area.unbind("mouseup");
          sroll_area.unbind("mouseleave");
          $(document).enableSelection();
          if (_ishide) _ishide_fn();
        });

        //滑鼠放開 bar外
        sroll_area.mouseup(function () {
          sroll_area.unbind("mousemove");
          sroll_area.unbind("mouseup");
          sroll_area.unbind("mouseleave");
          $(document).enableSelection();
          if (_ishide) _ishide_fn();
        });

        //滑鼠放開 bar內
        bar.mouseup(function () {
          sroll_area.unbind("mousemove");
          sroll_area.unbind("mouseup");
          sroll_area.unbind("mouseleave");
          $(document).enableSelection();
          if (_ishide) _ishide_fn();
        });

      });

      //●點擊bar_area
      bar_area.unbind("mousedown");
      bar_area.mousedown(function (event) {
        var y = event.pageY - bar_area.offset().top - (bar.height() / 2);//區塊座標
        if (y < 0) y = 0;           //限制bar拖曳範圍
        if (y > maxTop) y = maxTop; //限制bar拖曳範圍
        bar.css("top", y);

        //換算內容區塊的位置
        nowTop = Math.ceil((y / maxTop) * 100) * ((parseInt(sroll_area.height(), 10) - parseInt(sroll_body.height(), 10)) / 100);
        sroll_body.css("top", nowTop);
      });

      //●滑鼠滾輪
      function _scroll_fn(event) {
        event.preventDefault();

        //擷取是滾上還是滾下( -120向上滾, 120向下滾 )
        var scrollwhere = null;
        var isMAC = false;
        //for  ie, chrome
        if (event.type == "mousewheel") {
          scrollwhere = (event.originalEvent.wheelDelta * -1); //-120*-1=120, 120*-1=-120
        }
        //for  firefox
        if (event.type == "DOMMouseScroll") {
          scrollwhere = 40 * event.originalEvent.detail; //乘以40是為了讓firefox跟ie都用同一種數值(正負120)
        }

        if (scrollwhere != 120 && scrollwhere != -120) { isMAC = true; }//判斷是否是mac

        if (scrollwhere <= -120) {
          //滑鼠向上滾,物件向上走
          if (!isMAC) {
            nowTop += scrollVal;
            if (nowTop > minY) nowTop = minY;
          }
        } else if (scrollwhere >= 120) {
          //滑鼠向下,物件向下走
          if (!isMAC) {
            nowTop -= scrollVal;
            if (nowTop < maxY) nowTop = maxY;
          }
        } else {
          /*◎特別處理mac的觸控面板*/
          if (isMAC) {
            nowTop -= scrollwhere;
            if (nowTop > minY) nowTop = minY;
            if (nowTop < maxY) nowTop = maxY;
          }
        }

        sroll_body.css("top", nowTop);

        //換算bar滾動的百分比   公式想法:( 內容區塊的百分比 ) * ( bar區塊1%的像素 ) = top的像素
        percentTOpx = Math.ceil((nowTop / maxY) * 100) * ((parseInt(bar_area.height(), 10) - parseInt(bar.height(), 10)) / 100);
        bar.css("top", percentTOpx);

      }
      sroll_area.off("mousewheel DOMMouseScroll", sroll_body);
      sroll_area.on("mousewheel DOMMouseScroll", sroll_body, _scroll_fn);

      //●針對觸控寫的
      //window8 觸控專用: 傳回仿touchStart事件的touch物件
      function createTouchObject(e) {
        return { identifier: e.pointerId, pageX: e.clientX, pageY: e.clientY };
      }
      var istouchstart = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart"; //判斷使用事件名稱
      var istouchmove = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";   //判斷使用事件名稱
      var istouchend = window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";       //判斷使用事件名稱

      //觸控按下
      function _touchstart_fn(event) {
        if (window.navigator.msPointerEnabled) {
          //window8 觸控專用
          //由於滑鼠也會觸發，先檢查pointerType，只針對觸控做反應
          if (event.pointerType != event.MSPOINTER_TYPE_TOUCH) return;//由於滑鼠也會觸發，先檢查pointerType，只針對觸控做反應
          var t = createTouchObject(event);
          touches[t.identifier] = t;
        } else {
          //其他觸控專用
          //event.preventDefault();//取消瀏覽器默認行為
          if (_ishide) bar_area.fadeIn("slow");
          TouchY.push(event.touches[0].clientY);
          //處理內容移動 (寫在這邊用etInterval是為了touchmove的偵數太快在效能上會有問題)
          TouchInterval = setInterval(function () {
            var getLength = TouchY.length;
            var touchGap = TouchY[0] - TouchY[getLength - 1]; //觸控移動距離

            nowTop = nowTop - touchGap;
            if (nowTop > minY) nowTop = minY;//限制移動範圍
            if (nowTop < maxY) nowTop = maxY;//限制移動範圍
            sroll_body.css("top", nowTop);

            //換算bar滾動的百分比   公式想法:( 內容區塊的百分比 ) * ( bar區塊1%的像素 ) = top的像素
            percentTOpx = Math.ceil((nowTop / maxY) * 100) * ((parseInt(bar_area.height(), 10) - parseInt(bar.height(), 10)) / 100);
            bar.css("top", percentTOpx);

          }, 100);
        }
      }
      sroll_area[0].removeEventListener(istouchstart, _touchstart_fn, false);
      sroll_area[0].addEventListener(istouchstart, _touchstart_fn, false);
      //觸控移動
      function _touchmove_fn(event) {
        if (window.navigator.msPointerEnabled) {
          //window8 觸控專用
          if (event.pointerType != event.MSPOINTER_TYPE_TOUCH) return;//由於滑鼠也會觸發，先檢查pointerType，只針對觸控做反應
          var t = createTouchObject(event);
          var origT = touches[t.identifier];
          touches[t.identifier] = t;
          //與前次保存資料比較，偵測點觸控點是否移動
          if (origT && Math.abs(t.pageX - origT.pageX) + Math.abs(t.pageY - origT.pageY) > 1) {
            changedTouches[t.identifier] = t;
          } else {
            delete changedTouches[t.identifier];
          }

          var touchGap = origT.pageY - t.pageY; //觸控移動距離
          nowTop = nowTop - touchGap;
          if (nowTop > minY) nowTop = minY;//限制移動範圍
          if (nowTop < maxY) nowTop = maxY;//限制移動範圍
          sroll_body.css("top", nowTop);

          //換算bar滾動的百分比   公式想法:( 內容區塊的百分比 ) * ( bar區塊1%的像素 ) = top的像素
          percentTOpx = Math.ceil((nowTop / maxY) * 100) * ((parseInt(bar_area.height(), 10) - parseInt(bar.height(), 10)) / 100);
          bar.css("top", percentTOpx);

        } else {
          //其他觸控專用
          //event.preventDefault();//取消瀏覽器默認行為
          TouchY.push(event.touches[0].clientY);
        }
      }
      sroll_area[0].removeEventListener(istouchmove, _touchmove_fn, false);
      sroll_area[0].addEventListener(istouchmove, _touchmove_fn, false);
      //觸控放開 
      function _touchend_fn(event) {
        if (window.navigator.msPointerEnabled) {
          //window8 觸控專用
          if (event.pointerType != event.MSPOINTER_TYPE_TOUCH) return;//由於滑鼠也會觸發，先檢查pointerType，只針對觸控做反應
          var t = createTouchObject(event);
          //停止活動，將觸控點自touches及changedTouches移除
          delete touches[t.identifier];
          delete changedTouches[t.identifier];
        } else {
          //其他觸控專用
          //event.preventDefault();//取消瀏覽器默認行為
          TouchY = [];
          clearInterval(TouchInterval);
        }
      }
      sroll_area[0].removeEventListener(istouchend, _touchend_fn, false);
      sroll_area[0].addEventListener(istouchend, _touchend_fn, false);

      //是否使用一段時間就隱藏起來的方法
      if (_ishide) {
        bar_area.fadeOut(0);
        _ishide_fn();
      }

    });

  };

})(jQuery)