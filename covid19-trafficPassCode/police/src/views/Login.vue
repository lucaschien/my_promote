<template>
  <div class="login">
    <AppHeader :title="'登入頁 header'" />

    <div class="views-body">
      login 頁面
      <div>{{ testData }}</div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Cookies from 'js-cookie';
import stringUtils from '@/common/utils/StringUtils';
import { ajax, storage as StoreAction } from '@/common/';
import moment from "moment";
import popDialog from '@/common/popDialog';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

export default {
  name: 'Login',
  components: {
    AppHeader, Footer
  },
  data() {
    return {
      testData: null
    }
  },
  methods: {
    // TODO... 這一隻是實驗呼叫 ajax 用之後可刪
    test() {
      let peth = 'https://sit.eyesmedia.com.tw/covid19-footprint/api/v1/client/checkUserAndGetStoreInfo';
      let parm = {
        clientUserId: this.clientUserId
      };
      displayLog('checkUserAndGetStoreInfo path: ' + peth);
      displayLog('checkUserAndGetStoreInfo body: ' + JSON.stringify(parm));
      ajax.post(peth, parm).then((result) => {
        displayLog('checkUserAndGetStoreInfo success: ' + JSON.stringify(result));
        this.testData = result.data.user;
      }).catch((error) => {
        displayLog('checkUserAndGetStoreInfo error: ' + JSON.stringify(error));
      });
    }
  },
  computed: {
    ...mapGetters({
      clientUserId: 'getClientUserId'
    })
  },
  created() {
    document.title = '登入頁';
    this.test();
  }
}
</script>
