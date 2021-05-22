<template>
  <div class="login">
    <AppHeader :title="'登入頁 header'" />

    <div class="views-body">
      login 頁面
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
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
