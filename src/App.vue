<template>
<div id="app">
  <el-container class="menu">
    <el-header>
      <nav-component></nav-component>
    </el-header>
  </el-container>
  <el-container>
    <el-main class="main" v-bind:class="{ asideMin: this.$store.state.isCollapse }">
      <router-view></router-view>
    </el-main>
  </el-container>
</div>
</template>

<script>
// 引入组件
import NavComponent from 'components/nav-component.vue'

// vue
export default {
  name: 'app',
  asideWidth: '60',
  components: {
    NavComponent
  },
  beforeCreate: function() {},
  created: function() {},
  mounted: function() {
    this.socketOn();
  },
  methods: {
    socketOn: function() {
      let that = this;
      this.$socket.on('nav_check_part_fault', function(data) {
        console.log(data);
        for (let i = 0; i <= data.value.length; i++) {
          setTimeout(function() {
            that.$notify.error({
              title: '故障信息',
              message: data.value[i].unit + data.value[i].part + "发生故障. " + data.value[i].datetime,
              duration: 0,
            });
          }, 100);
        }
      });
    },
  },

  //socket
  sockets: {
    connect: function() {
      console.log('socket is connected');
    },
  },
}
</script>
<style lang="scss" scoped>
#app {
    padding: 0 40px;
}
.el-main {
    margin-left: 300px;
    padding: 112px 0 40px 40px;
    transition: margin 0.3s;
    z-index: 10;
    overflow: visible;
    > div {
        position: relative;
    }
    &.asideMin {
        margin-left: 60px;
    }
}

// 分辨率 大于 1300
@media (min-width: 1301px) {
    .el-main {
        margin-left: 300px;
    }
}
// 分辨率 992 - 1300
@media (max-width: 1300px) {
    #app {
        padding: 0 20px;
    }
    .el-main {
        margin-left: 188px;
        padding-left: 20px;
    }
}
// 分辨率 768 - 992
@media (max-width: 992px) {
    #app {
        padding: 0 20px;
    }
    .el-main {
        margin-left: 60px;
        padding-left: 20px;
    }
}
// 分辨率小于 768
@media (max-width: 768px) {
    #app {
        padding: 0 20px;
    }

    .el-main {
        margin-left: 0 !important;
        padding-left: 0;
    }
}
</style>
