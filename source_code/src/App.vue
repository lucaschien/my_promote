<template>

    <!--主畫面 ajax loading -->
    <div class="main_loading">資料載入中</div>
  
    <router-view/>

    <!--產品分類按鈕區塊-->
    <div class="worksType_btn_area">
      <div :class="['btn', {active: item.value === listType}]" 
        v-for="item in btns" :key="item.value"
        @click="chaneListTyle(item.value)">{{ item.word }}</div>
    </div>

    <!--前面大弧度區塊-->
    <div class="front_view_area">
      <!-- 前面弧度 -->
      <div class="front_view">
        <div class="front_left"><!--左icon--></div>
        <div class="front_right"><!--右版權--></div>
      </div>	
    </div>

    <!--logo-->
    <div class="logo"></div>
  
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from "vuex";
export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const listType = computed(() => store.getters.getListType);

    const chaneListTyle = (type:string) => {
      store.commit('setListType', type);
    }
    const btns = [
      {value: 'ALL', word: 'All'},
      {value: 'SYSTEM', word: 'System'},
      {value: 'WEB', word: 'Web'},
      {value: 'GAME', word: 'Game'},
      {value: 'GRAPHIC', word: 'Graphic Design'},
    ];
    return {
      listType,
      chaneListTyle,
      btns
    }
  }
})
</script>

<style lang="scss">
  @import "~@/scss/style.scss";
</style>
