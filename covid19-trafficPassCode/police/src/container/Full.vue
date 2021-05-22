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
  mounted() {
    alert(window.clientUserId);
    this.clientUserId = window.clientUserId;
  }
}
</script>
