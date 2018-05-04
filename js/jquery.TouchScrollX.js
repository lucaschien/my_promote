//實驗:自製左右拖曳scroll的套件(搭配jquery.ui.touch-punch.min.js就觸控,桌機都可用)
(function($){
	$.fn.TouchScrollX=function(){

		var target=this;//最大區塊
		var target_scroll=target.find(".jquery_scrollX_box");//scroll層
		var target_list=target.find(".jquery_scrollX_list:visible");//list層
		
		var targetWidth=0;//計算scroll層寬度用
		$.each(target_list,function(i,item){
			var PaddingLeft=parseInt($(item).css("paddingLeft"),10);//一個條列左邊內部距離寬度
			var PaddingRight=parseInt($(item).css("paddingRight"),10);//一個條列右邊內部距離寬度
			var MarginLeft=parseInt($(item).css("marginLeft"),10);//一個條列左邊外部距離寬度...有問題
			var MarginRight=parseInt($(item).css("marginRight"),10);//一個條列右邊外部距離寬度...有問題
			var BorderLeft=parseInt($(item).css("borderLeftWidth"),10);//一個條列左邊框寬度
			var BorderRight=parseInt($(item).css("borderRightWidth"),10);//一個條列右邊框寬度度
			targetWidth=targetWidth+(PaddingLeft+PaddingRight+MarginLeft+MarginRight+BorderLeft+BorderRight);
			targetWidth=targetWidth+parseInt($(item).width(),10);
		})
		if(targetWidth < parseInt(target.width(),10)){
			targetWidth=parseInt(target.width(),10);
		}else{
			target_scroll.css({"width":targetWidth});
		}
		//console.log(targetWidth);
		
		//定義:可以拖曳的左右範圍
		function checkLR_fn(){
			var getLEFT=parseInt(target_scroll.css("left"));
			var dropLeft=parseInt(target.width())-parseInt(target_scroll.width());
			//如果內容物的寬度小於範圍那就不用判斷往左或往右的範圍
			if(target_scroll.width()<target.width()){
				target_scroll.css("left",0);
				return false;
			}
			//往右拖曳的時候
			if(getLEFT>0){
				target_scroll.css("left",0);
			}
			//往左拖曳的時候
			if(getLEFT<=dropLeft){
				target_scroll.css("left",dropLeft+"px");
			}
		}
		//給予拖曳效果
		target_scroll.draggable({ 
			start: function(event, ui) {
				checkLR_fn();
			},
			stop: function(event, ui) {
				checkLR_fn();
			},
			axis: "x"
		});
	
	}
})(jQuery)