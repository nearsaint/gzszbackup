<template>
<div class="pageTitle">
  <h2>{{title}}</h2>
</div>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
export default {
  props: ['title'],
  data() {
    return {}
  },

  //组件
  components: {},

  //创建前
  beforeCreate: function() {},

  //创建后
  created: function() {},

  //渲染后
  mounted: function() {},

  //方法
  methods: {},
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会触发实时计算。
  computed: {},
  //监控
  watch: {},
}
</script>
<style lang="scss" scoped>
div.pageTitle {
    margin-bottom: 20px;
    color: #444;
    position: relative;
}
</style>
