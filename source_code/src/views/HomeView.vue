<template>
  <div class="home works_area">
    <div class="left-btn" @click="scroll('LEFT')"><i class="fa fa-angle-left" aria-hidden="true"></i></div>
    <div class="right-btn" @click="scroll('RIGHT')"><i class="fa fa-angle-right" aria-hidden="true"></i></div>

    <!--作品列表大區塊-->
    <ul class="work-list-scroll-box" ref="scrollBox">
      <transition-group name="fade" >
        <li v-for="(item, i) in listItem" :key="'list'+i">
          <div class="photo_area" 
            @click="look(item)">
            <img :src="item.imgurl">
          </div>
          <div class="text_area">{{ item.worktxt }}</div>
        </li>
      </transition-group>
    </ul>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useStore } from "vuex";

export default defineComponent({
  name: 'HomeView',
  setup() {
    const store = useStore();
    const listType = computed(() => store.getters.getListType);
    const scrollBox = ref(null);

    const demoJson = [
        { type: 'SYSTEM', imgurl: './worklist/system9.jpg', linkurl: './works/system/system9.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system6.jpg', linkurl: './works/system/system6.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system8.jpg', linkurl: './works/system/system8.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system7.jpg', linkurl: './works/system/system7.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system0.jpg', linkurl: './works/system/system0.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system1.jpg', linkurl: './works/system/system1.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system3.jpg', linkurl: './works/system/system3.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system4.jpg', linkurl: './works/system/system4.html', worktxt: 'System' },
        { type: 'SYSTEM', imgurl: './worklist/system2.jpg', linkurl: './works/system/system2.html', worktxt: 'System' },

        { type: 'WEB', imgurl : "./worklist/web0.jpg", linkurl : "./works/web0/index.html",     worktxt : "Web" },
        { type: 'WEB', imgurl : "./worklist/web1.jpg", linkurl : "./works/web1/www/index.html", worktxt : "Web" },
        { type: 'WEB', imgurl : "./worklist/web2.jpg", linkurl : "./works/web2/index.html",     worktxt : "Web" },
        { type: 'WEB', imgurl : "./worklist/web3.jpg", linkurl : "./works/web3/index.html",     worktxt : "Web" },

        { type: 'GAME', imgurl : "./worklist/game0.jpg", linkurl : "./works/html_game/game1.html",  worktxt : "Game" },
        { type: 'GAME', imgurl : "./worklist/game1.jpg", linkurl : "./works/html_game/game2.html",  worktxt : "Game Canvas" },
        { type: 'GAME', imgurl : "./worklist/game2.jpg", linkurl : "./works/flash_game/game1.html", worktxt : "Game Flash" },
        { type: 'GAME', imgurl : "./worklist/game3.jpg", linkurl : "./works/flash_game/game2.html", worktxt : "Game Flash" },

        { type: 'GRAPHIC', imgurl: "./worklist/p0.jpg",  linkurl: "./works/graphic/graphic0.html",  worktxt : "DM" },
        { type: 'GRAPHIC', imgurl: "./worklist/p1.jpg",  linkurl: "./works/graphic/graphic1.html",  worktxt : "DM" },
        { type: 'GRAPHIC', imgurl: "./worklist/p2.jpg",  linkurl: "./works/graphic/graphic2.html",  worktxt : "DM" },
        { type: 'GRAPHIC', imgurl: "./worklist/p3.jpg",  linkurl: "./works/graphic/graphic3.html",  worktxt : "Poster" },
        { type: 'GRAPHIC', imgurl: "./worklist/p4.jpg",  linkurl: "./works/graphic/graphic4.html",  worktxt : "Box" },
        { type: 'GRAPHIC', imgurl: "./worklist/p5.jpg",  linkurl: "./works/graphic/graphic5.html",  worktxt : "DM" },
        { type: 'GRAPHIC', imgurl: "./worklist/p6.jpg",  linkurl: "./works/graphic/graphic6.html",  worktxt : "Illustration" },
        { type: 'GRAPHIC', imgurl: "./worklist/p7.jpg",  linkurl: "./works/graphic/graphic7.html",  worktxt : "Poster" },
        { type: 'GRAPHIC', imgurl: "./worklist/p8.jpg",  linkurl: "./works/graphic/graphic8.html",  worktxt : "CI - logo" },
        { type: 'GRAPHIC', imgurl: "./worklist/p9.jpg",  linkurl: "./works/graphic/graphic9.html",  worktxt : "CI - BI" },
        { type: 'GRAPHIC', imgurl: "./worklist/p10.jpg", linkurl: "./works/graphic/graphic10.html", worktxt : "CI - BI" }
    ];

    /* const listItem = computed(() => {
      return (listType.value === 'ALL')? demoJson : demoJson.filter(item => item.type === listType.value);
    }); */
    const listItem = ref(JSON.parse(JSON.stringify(demoJson)));
    watch(() => listType.value, (newValue, oldValue) => {
      listItem.value.splice(0, listItem.value.length);
      setTimeout(() => {
        let temp:any = (newValue === 'ALL')? demoJson : demoJson.filter(item => item.type === newValue);
        temp.forEach((item: any, i: any) => {
          setTimeout((tt: any) => {
            listItem.value.push(tt);
          }, (100*i+1), item);
        });
        //listItem.value = listItem.value.concat(temp);
      }, 500);

    });

    const scroll = (type:string) => {
      let $scrollBox:any = scrollBox.value;
      let scrollLeft = $scrollBox.scrollLeft;
      scrollLeft = (type === 'RIGHT')? scrollLeft + 320 : scrollLeft - 320;
      $scrollBox.scrollLeft = scrollLeft;
    };

    const look = (item:any) => {
      console.log('item.type: ', item.type);
      //遊戲做外部連結 or 網頁做外部連結
      if (item.type === "GAME" || item.type === "WEB") {
        window.open(item.linkurl);
      }
    };

    return {
      listType,
      listItem,
      scroll,
      scrollBox,
      look
    }
  }
});
</script>
