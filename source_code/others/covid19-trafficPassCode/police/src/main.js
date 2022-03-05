// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/';
import axios from 'axios';
import appMixin from './common/app-mixin';
import VueSecureHTML from 'vue-html-secure';

// 第三方插件
import swal from 'sweetalert2';
import i18n from './i18n'; // Internationalization

Vue.mixin(appMixin);

// XSS
Vue.use(VueSecureHTML);

// swal setting
const swalPlugin = {};
swalPlugin.install = function (Vue) {
  swal.mixin({
    confirmButtonClass: 'btn-primary',
    cancelButtonClass: 'btn-secondary',
    focusConfirm: false
  });
  Vue.prototype.$swal = swal;
}
Vue.use(swalPlugin);

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding) {
    // Focus the element
    el.focus()
  }
});

// 指定哪些環境開啟 vue devtool
Vue.config.devtools = (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'sit' ||
  process.env.NODE_ENV === 'uat'
) ? true : false;

Vue.config.productionTip = false;

// 根据环境设置基本API
window.hostDomainURL = process.env.HOST_DOMAIN;
window.chatServicesURL = process.env.CHAT_SERVICES_API;
window.justkaServicesURL = process.env.JUSTKA_SERVICES_API;
window.chatFlowURL = process.env.CHAT_FLOW_API;
window.isDebugMode = process.env.DEBUG_MODE;
window.GA = process.env.GA;

// axios
window.axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
});
