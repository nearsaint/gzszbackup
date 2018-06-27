// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store.js'
import jquery from 'jquery'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import socketio from 'socket.io-client'
import io from 'vue-socket.io'
Vue.use(io, 'http://192.168.0.69:5001/data_refresh');
// 110 / 69
Vue.config.productionTip = false

// 引入 CSS
import 'styles/hack/normalize-7.0.0.min.css'
import 'styles/plugin/animate-3.6.0.min.css'
import 'styles/plugin/font-awesome-4.7.0.min.css'
import 'styles/page.scss'

// 引入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入reset
import 'styles/reset.scss'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  mounted: function() {},

  template: '<App/>'
})