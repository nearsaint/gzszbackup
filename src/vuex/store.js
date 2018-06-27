// 考虑如何更好地在组件外部管理状态(把组件的共享状态抽取出来,以一个全局单例模式管理呢)
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  //界面
  isCollapse: false, // 边栏打开
  asideWidth: '300',

  //数据
  data: {
    //设备组与设备列表
    unitlist: [],
  },
  //用户
  user: {
    userLogin: true, // 用户登录状态
    userID: null, //用户 ID
    userName: null, //用户名
    userJurisdiction: '', //用户权限
  },
}

export default new Vuex.Store({
  state
})