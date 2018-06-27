<template>
<menu class="menu">
  <a class="openSliderNav visible-xs-block" @click="openSlider()"><i class="fa fa-bars" aria-hidden="true"></i></a>
  <div class="logo asideWidth" v-bind:class="{ asideMin: this.$store.state.isCollapse }">
    <router-link title="首页" :to="{path: '/'}"></router-link>
  </div>
  <div class="navLeft hidden-xs">

  </div>
  <div class="navRight hidden-xs">
    <el-button circle><i class="fa fa-bell" aria-hidden="true"></i></el-button>
    <el-dropdown>
      <el-button round>
        Administrator
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人资料</el-dropdown-item>
        <el-dropdown-item divided>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <nav class="main asideWidth" v-bind:class="[{ asideMin: this.$store.state.isCollapse },this.sliderStatus?'open':'']">
    <a class="visible-xs-block closeSliderNav" @click="closeSlider()"><i class="fa fa-close" aria-hidden="true"></i></a>
    <a class="asideMin-btn hidden-xs hidden-sm" @click="changeAsideMin()"><i class="fa fa-outdent" aria-hidden="true"></i></a>
    <el-menu :unique-opened="true" class="el-menu-vertical-demo" :collapse="this.$store.state.isCollapse">
      <el-menu-item index="/">
        <router-link :to="{ path: '/'}"><i class="fa fa-dashboard"></i>
          <span>首页</span>
        </router-link>
      </el-menu-item>

      <el-submenu index="2" :class="($route.path.substring(0, 7)=='/device'||$route.path.substring(0, 6)=='/group')?'active':''">
        <template slot="title">
          <i class="fa fa-cubes"></i>
          <span>设备</span>
        </template>
        <el-menu-item index="/devices">
          <router-link :to="{ path: '/devices'}">
            <span>设备列表</span>
          </router-link>
        </el-menu-item>
        <el-menu-item-group>
          <el-submenu v-for="(items, indexs) in navList" :key="('group-'+indexs)" v-bind:index="('2-'+indexs)">
            <template slot="title">{{items.unit}}</template>
            <el-menu-item v-bind:index="('/group/'+items.unit)">
              <router-link :to="{ path:'/group/'+items.unit, query:{group:items.unit}}">
                <span>{{items.unit}}系统总览</span>
              </router-link>
            </el-menu-item>
            <el-menu-item v-for="(item, index) in items.parts" v-bind:index="('/device/'+indexs+index)" :key="('device-'+index)">
              <router-link :to="{ path:'/device/'+items.unit+item.part, query:{group:items.unit, device:item.part}}">
                <span>{{item.part}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu-item-group>
      </el-submenu>


      <el-submenu index="3" :class="($route.path.substring(0, 4)=='/msg'||$route.path.substring(0, 5)=='/part')?'active':''">
        <template slot="title">
          <i class="fa fa-warning"></i>
          <span>预警报警</span>
        </template>
        <el-menu-item index="/msgs">
          <router-link :to="{ path: '/msgs'}">
            <span>报警信息</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="/parts">
          <router-link :to="{ path: '/parts'}">
            <span>配件更换预警</span>
          </router-link>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="/powers" :class="($route.path.substring(0, 6)=='/power')?'active':''">
        <router-link :to="{ path: '/powers'}">
          <i class="fa fa-plug"></i>
          <span>能耗管理</span>
        </router-link>
      </el-menu-item>


      <el-submenu index="4" :class="($route.path.substring(0, 5)=='/user'||$route.path.substring(0, 9)=='/location')?'active':''">
        <template slot="title">
          <i class="fa fa-users"></i>
          <span>人员管理</span>
        </template>
        <el-menu-item index="/users">
          <router-link :to="{ path: '/users'}">
            <span>人员信息</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="/location">
          <router-link :to="{ path: '/location'}">
            <span>定位系统</span>
          </router-link>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="5" :class="($route.path.substring(0, 6)=='/order'||$route.path.substring(0, 7)=='/recipe')?'active':''">
        <template slot="title">
          <i class="fa fa-flask"></i>
          <span>质量与配方</span>
        </template>
        <el-menu-item index="/orders">
          <router-link :to="{ path: '/orders'}">
            <span>质量管理</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="/recipes">
          <router-link :to="{ path: '/recipes'}">
            <span>配方管理</span>
          </router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/bigData">
        <router-link :to="{ path: '/bigData'}"><i class="fa fa-dashboard"></i>
          <span>大数据</span>
        </router-link>
      </el-menu-item>
    </el-menu>
  </nav>
</menu>
</template>
<script>
import 'styles/menu.scss'
import {
  store
} from 'src/vuex/store.js'

export default {
  data() {
    return {
      navList: [],
      id: '',
      sliderStatus: false,
    }
  },

  //生命周期钩子函数
  beforeCreate: function() {},
  created: function() {
    this.asideMin();
    this.isCollapse = this.$store.state.isCollapse;
  },
  mounted: function() {
    window.onresize = () => {
      this.asideMin();
    };
    this.getNavList();
  },
  beforeDestroy: function() {},
  destroyed: function() {},

  methods: {
    openSlider: function() {
      this.sliderStatus = true;
    },
    closeSlider: function() {
      this.sliderStatus = false;
    },
    routeChange: function() {
      this.sliderStatus = false;
    },
    asideMin: function() {
      if (document.body.clientWidth <= 992) {
        this.$store.state.isCollapse = true;
      } else {
        this.$store.state.isCollapse = false;
      }
    },
    changeAsideMin: function() {
      if (this.$store.state.isCollapse) {
        this.$store.state.isCollapse = false;
      } else {
        this.$store.state.isCollapse = true;
      }
    },
    getNavList: function() {
      let that = this;
      this.$socket.emit('nav_query_all_parts', {
        'ID1': 'H',
      }, function(data) {
        this.navList = that.navList.concat(data);
        that.navList = this.navList;
        that.$store.state.data.unitlist = this.navList;
      })
    },
  },
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。
  computed: {},
  //组件
  components: {},
  //监视
  watch: {
    '$route': 'routeChange',
  }
}
</script>
<style lang="scss" scoped>

</style>
