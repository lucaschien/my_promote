<template>
  <div class="home works_area">

    <!--作品列表大區塊-->
    <ul class="work-list-scroll-box">
      <li v-for="(item, i) in demoJson.SYSTEM" :key="'list-system'+i">
        <a :src="item.linkurl">
          <div class="photo_area"><img :src="item.imgurl"></div>
          <div class="text_area">{{ item.worktxt }}</div>
        </a>
      </li>
    </ul>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HomeView',
  setup() {
    // 哪種作品類型: ALL, SYSTEM, WEB, GAME, GRAPHIC
    const listType = ref('ALL');

    const demoJson = {
      SYSTEM: [
        {imgurl: './worklist/system9.jpg', linkurl: './works/system/system9.html', worktxt: 'System' },
        {imgurl: './worklist/system6.jpg', linkurl: './works/system/system6.html', worktxt: 'System' },
        {imgurl: './worklist/system8.jpg', linkurl: './works/system/system8.html', worktxt: 'System' },
        {imgurl: './worklist/system7.jpg', linkurl: './works/system/system7.html', worktxt: 'System' },
        {imgurl: './worklist/system0.jpg', linkurl: './works/system/system0.html', worktxt: 'System' },
        {imgurl: './worklist/system1.jpg', linkurl: './works/system/system1.html', worktxt: 'System' },
        {imgurl: './worklist/system3.jpg', linkurl: './works/system/system3.html', worktxt: 'System' },
        {imgurl: './worklist/system4.jpg', linkurl: './works/system/system4.html', worktxt: 'System' },
        {imgurl: './worklist/system2.jpg', linkurl: './works/system/system2.html', worktxt: 'System' }
      ],
      WEB: [

      ],
      GAME: [

      ],
      DESING: [
        {imgurl: "./worklist/p0.jpg",  linkurl: "works/graphic/graphic0.html", worktxt : "DM" },
        {imgurl: "./worklist/p1.jpg",  linkurl: "works/graphic/graphic1.html", worktxt : "DM" },
        {imgurl: "./worklist/p2.jpg",  linkurl: "works/graphic/graphic2.html", worktxt : "DM" },
        {imgurl: "./worklist/p3.jpg",  linkurl: "works/graphic/graphic3.html", worktxt : "Poster" },
        {imgurl: "./worklist/p4.jpg",  linkurl: "works/graphic/graphic4.html", worktxt : "Box" },
        {imgurl: "./worklist/p5.jpg",  linkurl: "works/graphic/graphic5.html", worktxt : "DM" },
        {imgurl: "./worklist/p6.jpg",  linkurl: "works/graphic/graphic6.html", worktxt : "Illustration" },
        {imgurl: "./worklist/p7.jpg",  linkurl: "works/graphic/graphic7.html", worktxt : "Poster" },
        {imgurl: "./worklist/p8.jpg",  linkurl: "works/graphic/graphic8.html", worktxt : "CI - logo" },
        {imgurl: "./worklist/p9.jpg",  linkurl: "works/graphic/graphic9.html", worktxt : "CI - BI" },
        {imgurl: "./worklist/p10.jpg", linkurl: "works/graphic/graphic10.html", worktxt : "CI - BI" }
      ]
    };

    return {
      listType,
      demoJson
    }
  }
});
</script>
