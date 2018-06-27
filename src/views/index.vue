<template>
<div class="box">
  首页
</div>
<!-- end .box -->
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
import io from 'socket.io-client'
export default {
  data() {
    return {
      ID1: 'H',
    }
  },
  create() {},
  mounted() {
    // var socket = io.connect('http://192.168.0.69:5001/data_refresh');
    // socket.emit('query_partlist', {
    //   'ID1': this.ID1,
    //   'ID2': 'SB1'
    // }, function(res) {
    //   console.log(1);
    //   console.log(res);
    // })
  },
  beforeDestroy() {},
  methods: {},
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。
  computed: {},
  //组件
  components: {},
}
</script>
<style lang="scss" scoped></style>
