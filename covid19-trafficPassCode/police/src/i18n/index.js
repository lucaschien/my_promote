import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
// import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import elementZhTWLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import zhCNLocale from './zh_cn'
import zhTWLocale from './zh_tw'

Vue.use(VueI18n)

var browserLG = window.navigator.language.toLowerCase(); //使用者當地語系
var useLG;
//使用者是否有指定使用哪種語系
if (!Cookies.get('language')) {
  //如果當地語系不是繁簡體就強制用繁體
  if (browserLG !== 'zh-tw' && browserLG !== 'zh-cn') {
    browserLG = 'zh-tw';
  }
  Cookies.set('language', browserLG);
  useLG = browserLG;
} else {
  useLG = Cookies.get('language');
  //如果之前的cookie不是繁簡體就強制用繁體
  if (useLG !== 'zh-tw' && useLG !== 'zh-cn') {
    useLG = 'zh-tw';
    Cookies.set('language', useLG);
  }
}

const messages = {
  ['zh-cn']: {
    ...zhCNLocale
  },
  ['zh-tw']: {
    ...zhTWLocale
  }
};

const i18n = new VueI18n({
  locale: useLG, // set locale
  messages,      // set locale messages
  silentTranslationWarn: true
});

export default i18n
