import { createStore } from 'vuex'
import mutations from "./mutations";
import getters from './getters'
import actions from './actions'

const state = {
  user:{
    islogin : window.localStorage.getItem('token') ? true : false
  },
  addCount:0
}
export default createStore({
  state,
  getters,
  mutations,
  actions,

})
