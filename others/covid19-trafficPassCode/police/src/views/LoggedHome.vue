<template>
  <div class="logged-home">
    <AppHeader :title="'登入後首頁 header'" />

    <div class="views-body">
      登入後首頁
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
  name: 'LoggedHome',
  components: {
    AppHeader, Footer
  },
  data() {
    return {
    }
  },
  methods: {
  },
  created() {
    document.title = '登入後首頁';
  }
}
</script>
