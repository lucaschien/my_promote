<template>
  <div :class="['main']">
    <div style="padding: 10px 20px;">
      <router-link to="/">登入頁</router-link> |
      <router-link to="/home">登入後首頁</router-link> |
      <router-link to="/gui">GUI</router-link>
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
  created() {
    // 解析網址參數
    function parseURLparm() {
      var href = window.location.href;
      var vars = {}, hash;
      var hashes = href.slice(href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (Array.isArray(hash[0], vars) > -1) {
          vars[hash[0]] = hash[1];
        }
      }
      return vars;
    }

    // liff 初始化
    var urlParm = parseURLparm();
    window.liffId = urlParm.liffId;
    window.endpointType = urlParm.endpointType;

    displayLog('urlParm: '+JSON.stringify(urlParm));

    if (liff) {
      // TODO... 先寫死我個人的 liffId
      liff.init({ liffId: '1633210473-BZ1zNNWk' }).then(() => {
        var accessToken = liff.getAccessToken();
        displayLog('accessToken: '+JSON.stringify(accessToken));

        //透過 token 取得使用者資訊
        fetch('https://api.line.me/v2/profile', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+accessToken
          },
        }).then(response => {
          return response.json();
        }).then((data) => {
          window.clientUserId = data;
          displayLog('liff userId: '+data.userId);
          displayLog('liff displayName: '+data.displayName);
          displayLog('liff pictureUrl: '+data.pictureUrl);
        }).catch((error) => {
          displayLog('取得使用者資訊 error: '+JSON.stringify(error));
        });

      }).catch((error) => {
        displayLog('liff.init error: '+JSON.stringify(error));
      });
    }

  }
}
</script>
