<template>
<div>

</div>
</template>
<style lang="scss" scoped></style>
<script>
import {
  store
} from '../vuex/store.js'
export default {
  data() {
    return {

    }
  },
  created: function() {},
  mounted: function() {},
  beforeDestroy: function() {
    console.log('box-component.vue well destroyed');
    this.$socket.removeAllListeners('div_query_all_parts');
  },
  //监控
  watch: {},
  //方法
  methods: {},
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。
  computed: {},
  //组件
  components: {},
}
</script>
