webpackJsonp([5],{128:function(t,n,e){"use strict";var a=e(189),o=e.n(a),r=e(190),i={normal:function(t,n,e,a){o()({title:t,html:n,confirmButtonText:r.a.generateTitle("common.certain"),showCancelButton:!0,cancelButtonText:r.a.generateTitle("common.cancel"),allowOutsideClick:!1,allowEscapeKey:!1,customClass:"pop_dialog for-normal"}).then(function(t){t.value&&e&&e(),a&&a()}).catch(function(t){a&&a()})},alert:function(t,n){o()({html:t,confirmButtonText:r.a.generateTitle("common.certain"),confirmButtonClass:"btn-secondary",allowOutsideClick:!1,allowEscapeKey:!1,customClass:"pop_dialog for-alrat"}).then(function(t){n&&n()}).catch(function(t){n&&n()})},singleBtn:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:r.a.generateTitle("common.certain"),a=arguments[3];o()({title:t,html:n,confirmButtonText:e,confirmButtonClass:"btn-secondary",allowOutsideClick:!1,allowEscapeKey:!1,customClass:"pop_dialog for-singleBtn"}).then(function(t){t.value&&a&&a()}).catch(function(t){a&&a()})},timer:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2e3;o()({html:t,showConfirmButton:!1,allowOutsideClick:!1,allowEscapeKey:!1,customClass:"timer",background:"transparent",backdrop:"transparent",timer:e}).then(function(t){n&&n()}).catch(function(t){n&&n()})}};n.a=i},166:function(t,n,e){"use strict";n.a={name:"App"}},188:function(t,n,e){"use strict";var a=e(462),o=e.n(a),r=e(122),i=e.n(r),c=e(465),s=e.n(c),u=(e(126),e(84)),l=(e.n(u),e(85),e(64)),f=e(127),d=(e.n(f),e(128),e(472),e(192)),h=e.n(d);n.a={name:"full",data:function(){return{clientUserId:null,userDevice:function(){var t=new h.a(window.navigator.userAgent);return{os:t.os(),agent:t.userAgent(),iphone:t.is("iPhone"),android:t.is("AndroidOS"),iPad:t.is("iPad"),chrome:t.is("Chrome")}}()}},methods:{checkUserAndGetStoreInfo:function(){var t=this;return s()(o.a.mark(function n(){var e,a,r;return o.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return t.clientUserId=window.clientUserId,e="https://sit.eyesmedia.com.tw/covid19-footprint/api/v1/client/checkUserAndGetStoreInfo",a={clientUserId:t.clientUserId},displayLog("checkUserAndGetStoreInfo body: "+e),displayLog("checkUserAndGetStoreInfo body: "+i()(a)),n.next=7,l.a.post(e,a);case 7:r=n.sent,displayLog("checkUserAndGetStoreInfo 回傳: "+i()(r));case 9:case"end":return n.stop()}},n,t)}))()}},mounted:function(){this.checkUserAndGetStoreInfo()}}},190:function(t,n,e){"use strict";var a=e(123),o=e.n(a),r=e(124),i=e.n(r),c=e(191),s=function(){function t(){o()(this,t)}return i()(t,[{key:"generateTitle",value:function(t){var n=c.a.te(""+t),e=c.a.t(""+t);return n?e:t}}]),t}(),u=new s;n.a=u},191:function(t,n,e){"use strict";var a,o=e(467),r=e.n(o),i=e(468),c=e.n(i),s=e(79),u=e(469),l=e(84),f=e.n(l),d=e(470),h=e(471);s.a.use(u.a);var p,m=window.navigator.language.toLowerCase();f.a.get("language")?"zh-tw"!==(p=f.a.get("language"))&&"zh-cn"!==p&&(p="zh-tw",f.a.set("language",p)):("zh-tw"!==m&&"zh-cn"!==m&&(m="zh-tw"),f.a.set("language",m),p=m);var v=(a={},r()(a,"zh-cn",c()({},d.a)),r()(a,"zh-tw",c()({},h.a)),a),w=new u.a({locale:p,messages:v,silentTranslationWarn:!0});n.a=w},201:function(t,n,e){e(202),t.exports=e(404)},404:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e(79),o=e(407),r=e(415),i=e(475),c=e(480),s=e.n(c),u=e(498),l=e(499),f=e.n(l),d=e(189),h=e.n(d),p=e(191);a.a.mixin(u.a),a.a.use(f.a);var m={};m.install=function(t){h.a.mixin({confirmButtonClass:"btn-primary",cancelButtonClass:"btn-secondary",focusConfirm:!1}),t.prototype.$swal=h.a},a.a.use(m),a.a.directive("focus",{inserted:function(t,n){t.focus()}}),a.a.config.devtools=!0,a.a.config.productionTip=!1,window.hostDomainURL="//sit.eyesmedia.com.tw",window.chatServicesURL=Object({NODE_ENV:"sit",HOST_DOMAIN:"//sit.eyesmedia.com.tw",DEBUG_MODE:!1,STATIC_PATH:"/static",ROUTER_PATH:"/"}).CHAT_SERVICES_API,window.justkaServicesURL=Object({NODE_ENV:"sit",HOST_DOMAIN:"//sit.eyesmedia.com.tw",DEBUG_MODE:!1,STATIC_PATH:"/static",ROUTER_PATH:"/"}).JUSTKA_SERVICES_API,window.chatFlowURL=Object({NODE_ENV:"sit",HOST_DOMAIN:"//sit.eyesmedia.com.tw",DEBUG_MODE:!1,STATIC_PATH:"/static",ROUTER_PATH:"/"}).CHAT_FLOW_API,window.isDebugMode=!1,window.GA=Object({NODE_ENV:"sit",HOST_DOMAIN:"//sit.eyesmedia.com.tw",DEBUG_MODE:!1,STATIC_PATH:"/static",ROUTER_PATH:"/"}).GA,window.axios=s.a,s.a.defaults.headers.post["Content-Type"]="application/json",s.a.defaults.headers.put["Content-Type"]="application/json",s.a.defaults.headers.delete["Content-Type"]="application/json",new a.a({el:"#app",router:r.a,store:i.a,i18n:p.a,components:{App:o.a},template:"<App/>"})},407:function(t,n,e){"use strict";function a(t){e(408)}var o=e(166),r=e(414),i=e(125),c=a,s=i(o.a,r.a,!1,c,null,null);n.a=s.exports},408:function(t,n){},414:function(t,n,e){"use strict";var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"app"},[e("router-view")],1)},o=[],r={render:a,staticRenderFns:o};n.a=r},415:function(t,n,e){"use strict";var a=e(79),o=e(416),r=(e(64),e(84)),i=(e.n(r),e(461)),c=function(){return e.e(3).then(e.bind(null,502))},s=function(){return e.e(1).then(e.bind(null,503))},u=function(){return e.e(2).then(e.bind(null,504))},l=function(){return e.e(0).then(e.bind(null,505))};a.a.use(o.a);var f=new o.a({base:"/",mode:"hash",linkActiveClass:"open active",scrollBehavior:function(){return{y:0}},routes:[{path:"/",component:i.a,children:[{path:"/",name:"Login",component:s},{path:"/home",name:"LoggedHome",component:u},{path:"/redirect",name:"Redirect",component:c},{path:"/gui",name:"GUI",component:l}]}]});f.beforeEach(function(t,n,e){e()}),n.a=f},417:function(t,n,e){"use strict";e.d(n,"a",function(){return s});var a=e(167),o=e.n(a),r=e(186),i=e.n(r),c=function(t,n,e){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=i()({},a,{url:n,method:t,data:e});return r.headers=i()({},r.headers,{"X-Requested-With":"XMLHttpRequest"}),new o.a(function(t,n){window.axios.request(r).then(function(e){var a=e.data;if(!a)return t(e);a.HasError&&(e.config.notNotifyError,n(e)),t(a)}).catch(function(t){if(!t.response){return n({})}t.response.status,n(t.response)})})},s={get:function(t,n){return c("get",t,null,n)},delete:function(t,n,e){return c("delete",t,n,e)},head:function(t,n){return c("head",t,null,n)},post:function(t,n,e){return c("post",t,n,e)},put:function(t,n,e){return c("put",t,n,e)},patch:function(t,n,e){return c("path",t,n,e)},setCommonHeader:function(t,n){window.axios.defaults.headers.common[t]=n},checkErrorCode:function(t){return t===(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"996600001")}}},452:function(t,n,e){"use strict";var a=e(122),o=e.n(a),r=e(123),i=e.n(r),c=e(124),s=e.n(c),u=function(){function t(n){i()(this,t),this.storage=n}return s()(t,[{key:"get",value:function(t){var n=this.storage.getItem(t);try{return JSON.parse(n)}catch(t){return n}}},{key:"set",value:function(t,n){var e=o()(n);return this.storage.setItem(t,e)}},{key:"remove",value:function(t){this.storage.removeItem(t)}}]),t}();new u(window.localStorage)},456:function(t,n,e){"use strict";var a=e(457);e.n(a)},460:function(t,n,e){"use strict"},461:function(t,n,e){"use strict";var a=e(188),o=e(474),r=e(125),i=r(a.a,o.a,!1,null,null,null);n.a=i.exports},470:function(t,n,e){"use strict";n.a={common:{close:"关闭",certain:"确定",cancel:"取消"}}},471:function(t,n,e){"use strict";n.a={common:{close:"關閉",certain:"確定",cancel:"取消"}}},474:function(t,n,e){"use strict";var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{class:["main"]},[e("div",{staticStyle:{padding:"10px 20px"}},[e("router-link",{attrs:{to:"/"}},[t._v("登入頁")]),t._v(" |\n    "),e("router-link",{attrs:{to:"/home"}},[t._v("登入後首頁")]),t._v(" |\n    "),e("router-link",{attrs:{to:"/gui"}},[t._v("GUI")]),t._v(" |\n    clientUserId: "+t._s(t.clientUserId)+"\n  ")],1),t._v(" "),e("router-view",{staticClass:"views-contnet"})],1)},o=[],r={render:a,staticRenderFns:o};n.a=r},475:function(t,n,e){"use strict";var a=e(79),o=e(126),r=e(476),i=e(477),c=e(478),s=e(479);a.a.use(o.a);var u=new o.a.Store({state:r.a,mutations:i.a,getters:c.a,actions:s.a,modules:{}});n.a=u},476:function(t,n,e){"use strict";var a=e(192),o=e.n(a),r={isMobile:function(){var t=new o.a(window.navigator.userAgent),n=t.os();t.userAgent();return null!==n}()};n.a=r},477:function(t,n,e){"use strict";var a=e(127),o=(e.n(a),e(64),{});n.a=o},478:function(t,n,e){"use strict";var a={getIsMobile:function(t){return t.isMobile}};n.a=a},479:function(t,n,e){"use strict";var a=(e(64),e(85),e(128),e(190),{});n.a=a},498:function(t,n,e){"use strict";var a=e(85);n.a={data:function(){return{STATIC_PATH:"/static"}},methods:{replaceHttpsToAlink:function(t){return a.a.replaceHttpsToAlink(t)},scrollLRAnimate:function(t,n){var e=n.offsetWidth,a=n.scrollLeft;if(!(a<=0&&"LEFT"===t))for(var o=0;o<e;o++)!function(e){var o=e;setTimeout(function(){var e="LEFT"===t?a-o:a+o;n.scrollLeft=e},1.2*e)}(o)}}}},64:function(t,n,e){"use strict";var a=e(417);e(452),e(456),e(460);e.d(n,"a",function(){return a.a})},85:function(t,n,e){"use strict";var a=e(122),o=e.n(a),r=e(123),i=e.n(r),c=e(124),s=e.n(c),u=function(){function t(){i()(this,t)}return s()(t,[{key:"format",value:function(t){var n=Array.prototype.slice.call(arguments,1);return t.replace(/{(\d+)}/g,function(t,e){return void 0!==n[e]?n[e]:t})}},{key:"toSBC",value:function(t){for(var n="",e=0;e<t.length;e++)12288!=t.charCodeAt(e)?t.charCodeAt(e)>65280&&t.charCodeAt(e)<65375?n+=String.fromCharCode(t.charCodeAt(e)-65248):n+=String.fromCharCode(t.charCodeAt(e)):n+=String.fromCharCode(t.charCodeAt(e)-12256);return n}},{key:"replaceHttpsToAlink",value:function(t){var n=JSON.parse(o()(t)),e=/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|%|#|@)+)/g;return n=n.replace(e,'<a href="$1$2" target="_blank">$1$2</a>')}}]),t}(),l=new u;n.a=l}},[201]);