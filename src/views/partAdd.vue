<template>
<div class="partVue">
  <page-title v-bind:title="'添加新提醒'"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/parts' }">配件更换预警</el-breadcrumb-item>
      <el-breadcrumb-item>添加新提醒</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
</div>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
import pageTitle from 'components/pagetitle-component.vue'
export default {
  data() {
    return {}
  },


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
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': ' '
  },
  //组件
  components: {
    pageTitle
  },
  beforeDestroy: function() {},
}
</script>
<style lang="scss" scoped></style>
