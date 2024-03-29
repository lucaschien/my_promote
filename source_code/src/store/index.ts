import { createStore } from 'vuex'

export default createStore({
  state: {
    listType: 'SYSTEM', // 哪種作品類型: ALL, SYSTEM, WEB, GAME, GRAPHIC, TOOLS
    detailSrc: null, // 詳細作品網址
  },
  getters: {
    getListType: (state) => state.listType,
    getDetailSrc: (state) => state.detailSrc,
  },
  mutations: {
    setListType: (state, payload) => {
      state.listType = payload;
    },
    setDetailSrc: (state, payload) => {
      state.detailSrc = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
