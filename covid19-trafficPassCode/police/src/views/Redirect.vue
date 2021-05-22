<template>
  <div class="redirect">
    <div class="views-body">
      Redirect... 這一隻是預想所有從別處近來時處理liff 的相關頁面, 但也有可能會在full.vue處理
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Cookies from 'js-cookie';
import stringUtils from '@/common/utils/StringUtils';
import { ajax, storage as StoreAction } from '@/common/';
import moment from "moment";
import popDialog from '@/common/popDialog';

export default {
  name: 'Redirect',
  data() {
    return {}
  },
  created() {
    document.title = '轉換中';
  }
}
</script>
