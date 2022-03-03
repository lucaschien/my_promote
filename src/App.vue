<template>

    <!--主畫面 ajax loading -->
    <div class="main_loading">資料載入中</div>
  
    <router-view/>

    <!--產品分類按鈕區塊-->
    <div class="worksType_btn_area">
      <div class="btn" worktype="all">All</div
      ><div class="btn" worktype="s">System</div
      ><div class="btn" worktype="w">Web</div
      ><div class="btn" worktype="g">Game</div
      ><div class="btn" worktype="p">Graphic Design</div>
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

<style lang="scss">
  @import "~@/scss/style.scss";
</style>
