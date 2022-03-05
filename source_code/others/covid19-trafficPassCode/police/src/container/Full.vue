<template>
  <div :class="['main']">
    <div style="padding: 10px 20px;">
      <router-link to="/">登入頁</router-link> |
      <router-link to="/home">登入後首頁</router-link> |
      <router-link to="/gui">GUI</router-link> |
      clientUserId: {{ clientUserId }}
    </div>
    <router-view class="views-contnet" v-if="clientUserId"></router-view>
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
    ...mapMutations(['setClientUserId'])
  },
  computed: {
    ...mapGetters({
      clientUserId: 'getClientUserId'
    })
  },
  mounted() {
    // 注意: 由於本地端與實際 liff 上面的程式訊息不同, 因此這邊使用 loop 的方式去監聽是否有取得 clientUserId
    window.checkClientUserIdTimer = setInterval(() => {
      displayLog('是否取得clientUserId: ' + window.clientUserId);
      if (!window.clientUserId) return false; // 未取得
      displayLog('已取得clientUserId: ' + window.clientUserId);
      // 已取得
      this.setClientUserId(window.clientUserId);
      clearInterval(window.checkClientUserIdTimer);
    }, 300);
  },
}
</script>
