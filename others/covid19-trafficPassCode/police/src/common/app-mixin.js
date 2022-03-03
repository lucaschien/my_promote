import stringUtils from '@/common/utils/StringUtils';

export default {
  data() {
    return {
      STATIC_PATH: `${process.env.STATIC_PATH}` // 靜態資源的變數
    }
  },
  methods: {
    // 將 http 或 https 開頭的字串轉成 <a>
    replaceHttpsToAlink(msg) {
      return stringUtils.replaceHttpsToAlink(msg);
    },
    /** 左右 div scroll 動畫效果
     *    LR    string    移動方向: LEFT, RIGHT
     *    $div  html dom  scroll的容器
    */
    scrollLRAnimate(LR, $div) {
      let width = $div.offsetWidth;
      let scrollLeft = $div.scrollLeft;
      if (scrollLeft <= 0 && LR === 'LEFT') return
      for (let i = 0; i < width; i++) {
        let index = i;
        setTimeout(() => {
          let left = (LR === 'LEFT') ? scrollLeft - index : scrollLeft + index;
          $div.scrollLeft = left;
        }, i*1.2);
      }
    }
  }
}
