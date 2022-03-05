import { createStore } from 'vuex'

export default createStore({
  state: {
    listType: 'ALL' // 哪種作品類型: ALL, SYSTEM, WEB, GAME, GRAPHIC
  },
  getters: {
    getListType: (state) => state.listType,
  },
  mutations: {
    setListType: (state, payload) => {
      state.listType = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
