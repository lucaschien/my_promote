<template>
  <div class="gui">
    <AppHeader :title="'GUI頁面 header'" />

    <div class="views-body">
      <!-- 觀看目前fome表單元素樣式 -->
      <div class="testUnit-box hide">
        <h5 @click="triggerFn($event)">觀看目前fome表單元素樣式</h5>
        <div class="testUnit-body">

          <input type="text" placeholder="input 請輸入">
          <input type="text" placeholder="input 請輸入" disabled>

          <textarea placeholder="textarea 請輸入"></textarea>
          <textarea placeholder="textarea 請輸入" disabled></textarea>

          <select>
            <option value="--">請選則</option>
            <option value="1">a</option>
            <option value="2">b</option>
          </select>
          <select disabled>
            <option value="--">請選則</option>
            <option value="1">a</option>
            <option value="2">b</option>
          </select>

          <label>
            <input type="checkbox">確認
          </label>
          <label class="disabled">
            <input type="checkbox" disabled>確認
          </label>

          <label>
            <input type="radio" value="a" name="testradio">選項一
          </label>
          <label>
            <input type="radio" value="b" name="testradio">選項二
          </label>

          <label class="disabled">
            <input type="radio" value="a" name="testradio2" disabled>選項一
          </label>
          <label class="disabled">
            <input type="radio" value="b" name="testradio2" disabled>選項二
          </label>

          <button type-="button">button</button>
          <button type-="button" disabled>button</button>

          <table>
            <thead>
              <tr>
                <th>欄位一</th>
                <th>欄位二</th>
                <th>欄位三</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>aa</td>
                <td>22</td>
                <td>33</td>
              </tr>
              <tr>
                <td>bb</td>
                <td>55</td>
                <td>66</td>
              </tr>
              <tr>
                <td>cc</td>
                <td>55</td>
                <td>66</td>
              </tr>
              <tr>
                <td>dd</td>
                <td>55</td>
                <td>66</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      <!-- font-awesome 4.0 -->
      <div class="testUnit-box">
        <h5>font-awesome 4.0</h5>
        <div class="testUnit-body">
          <a href="https://fontawesome.com/v4.7.0/icons/" target="_blank">https://fontawesome.com/v4.7.0/icons/</a>
          <br>
          <i class="fa fa-refresh"></i>
          <i class="fa fa-check"></i>
        </div>
      </div>

      <!-- 觀看 src/common/popDialog.js 中定義的幾種 dialog -->
      <div class="testUnit-box hide">
        <h5 @click="triggerFn($event)">觀看 src/common/popDialog.js 中定義的幾種 dialog</h5>
        <div class="testUnit-body">
          <button type="button" @click="popDialog.normal('title word', '使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal使用 normal')">使用 normal</button>
          <button type="button" @click="popDialog.alert('使用 alert')">使用 alert</button>
          <button type="button" @click="popDialog.singleBtn('title word', '使用 singleBtn')">使用 singleBtn</button>
          <button type="button" @click="popDialog.timer(`使用 timer<div style='color: green;'>實驗 html code </div>`, null, 2000)">使用 timer</button>
          <button type="button" @click="popDialog.timer('使用 timer 有callback', test_forPopDialogTimer, 500)">使用 timer 有callback</button>
        </div>
      </div>

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
  name: 'GUI',
  components: {
    AppHeader, Footer
  },
  data() {
    return {
      popDialog: popDialog,
      moment: moment,
      stringUtils: stringUtils
    }
  },
  methods: {
    triggerFn(event) {
      let $box = event.target.parentNode;
      let nowClassName = $box.className;
      let newClassName = (nowClassName.match('hide'))? 'testUnit-box' : 'testUnit-box hide';
      $box.className = newClassName;
    }
  }
}
</script>

<style lang="scss">
.gui::-webkit-scrollbar {
  display: block;
}
.gui {

  .testUnit-box {
    border-bottom: 3px solid #ccc;
    margin-bottom: 40px;
    padding-bottom: 40px;

    h5 {
      padding: 0;
      margin-bottom: 15px;
      cursor: pointer;
      display: inline-block;
    }

    &.hide {
      h5 {
        margin-bottom: 0px;
      }
      .testUnit-body {
        display: none;
      }
    }
  }

  button, textarea, select, input {
    margin-bottom: 10px;
  }

}
</style>
