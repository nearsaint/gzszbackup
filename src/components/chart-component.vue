<template>
<div class="chartModel">
  <div class="mark"></div>
</div>
</template>
<script>
import {
  store
} from '../vuex/store.js'
export default {
  props: ['title', ],
  data() {
    return {
      echart: '',
    }
  },
  created: function() {},
  mounted: function() {},
  methods: {},
  computed: {},
  components: {},
  beforeDestroy: function() {
    this.$socket.removeAllListeners('div_check_point_data');
  },
}
</script>
<style lang="scss" scoped >
div.chartModel {
    position: absolute;
    min-height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    > div.mark {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.8);
    }
}
</style>
