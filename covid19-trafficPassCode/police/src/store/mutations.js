
import moment from 'moment'
import { storage } from '@/common/'


const mutations = {
  setClientUserId(state, id) {
    state.clientUserId = id;
  }
}

export default mutations
