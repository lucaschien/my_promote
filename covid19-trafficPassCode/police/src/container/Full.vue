<template>
  <div :class="['main']">
    <div style="padding: 10px 20px;">
      <router-link to="/">登入頁</router-link> |
      <router-link to="/home">登入後首頁</router-link> |
      <router-link to="/gui">GUI</router-link> |
      clientUserId: {{ clientUserId }}
    </div>
    <router-view class="views-contnet"></router-view>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Cookies from 'js-cookie';
import stringUtils from '@/common/utils/StringUtils';
import { ajax, storage as StoreAction } from '@/common/';
import moment from "moment";
import popDialog from '@/common/popDialog';
import jwt_decode from "jwt-decode";
import MobileDetect from 'mobile-detect';

export default {
  name: "full",
  data() {
    return {
      clientUserId: null,
      // user 當前的載具資訊
      userDevice: (() => {
        var md = new MobileDetect(window.navigator.userAgent);
        return  {
          os: md.os(),
          agent: md.userAgent(),
          iphone: md.is('iPhone'),
          android: md.is('AndroidOS'),
          iPad: md.is('iPad'),
          chrome: md.is('Chrome')
        }
      })()
    }
  },
  methods: {
    async checkUserAndGetStoreInfo() {
      this.clientUserId = window.clientUserId;
      let peth = 'https://sit.eyesmedia.com.tw/covid19-footprint/api/v1/client/checkUserAndGetStoreInfo';
      let parm = {
        clientUserId: this.clientUserId
      };
      displayLog('checkUserAndGetStoreInfo path: ' + peth);
      displayLog('checkUserAndGetStoreInfo body: ' + JSON.stringify(parm));
      let result = await ajax.post(peth, parm);
      displayLog('checkUserAndGetStoreInfo 回傳: ' + JSON.stringify(result));
    }
  },
  mounted() {
    displayLog('if liff: ' + liff);
    displayLog('if window.liff: ' + window.liff);

    this.checkUserAndGetStoreInfo();
    document.title = '測試中';
  }
}
</script>
