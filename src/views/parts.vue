<template>
<div>
  <page-title v-bind:title="'配件更换预警'"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配件更换预警</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="partsList">
      <div class="add">
        <el-button type="primary" round @click="gotoPartAdd()">添加新提醒</el-button>
      </div>
      <div class="inhaul">
        <!-- <div class="sort">
          <el-select v-model="openClose" placeholder="全部启停" @change="getSort_openClose">
            <el-option v-for="item in openClose_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <!-- <div class="sort">
          <el-select v-model="status" placeholder="全部状态" @change="getSort_status">
            <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="sort">
          <el-select v-model="group" placeholder="全部系统" @change="getSort_group">
            <el-option v-for="item in group_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sort">
          <el-select v-model="device" placeholder="全部设备" @change="getSort_device">
            <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sort">
          <el-select v-model="status" placeholder="全部设备" @change="getSort_status">
            <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search">
          <el-input v-model="search" placeholder="请输入您要找的关键字" suffix-icon="el-icon-search" clearable @keyup.enter.native="getSearch">
          </el-input>
        </div>
      </div>
      <h5 v-if="total==0">{{total0}}</h5>
      <ul class="list" v-show="total>0">
        <div class="title ">
          <div class="statusDot ">
            指示
          </div>
          <div class="main ">
            <div class="name ">
              设备
            </div>
            <div class="status hidden-xs ">
              状态
            </div>
            <div class="edit ">
            </div>
          </div>
        </div>
        <li v-for="(item, index) in partsList" :key="index" class="animated fadeIn">
          <div class="statusDot">
            <b v-bind:class="[(item.status==1) ? 'running' : 'warning',(item.isrunning==0) ? 'closed' : '' ]"></b>
          </div>
          <div class="main">
            <div class="name">
              <h5>{{item.name}}</h5>
              <h6>{{item.unit}}</h6>
            </div>
            <div class="status" v-bind:class="[(item.status==1) ? 'running' : 'warning',(item.isrunning==0) ? 'closed' : '' ]">
              <h5></h5>
              <h6></h6>
            </div>
            <div class="edit ">
              <el-button type="primary " round @click="gotoDevice(item.unit,item.name)">查看设备</el-button>
            </div>
          </div>
        </li>
        <el-pagination v-if="total>10" @current-change="getPage" background layout="prev, pager, next" :total="this.total" :current-page.sync="inhaul_page">
        </el-pagination>
      </ul>
    </div>
  </div>
  <transition name="el-fade-in-linear">
    <router-view class="partView"></router-view>
  </transition>
</div>
</template>
<script>
import {
  store
} from 'src/vuex/store.js'
// 引入组件
import pageTitle from 'components/pagetitle-component.vue'
export default {
  data() {
    return {
      //引索状态
      status_options: [{
        value: '',
        label: '全部状态'
      }, {
        value: 1,
        label: '需更换'
      }, {
        value: 2,
        label: '正常'
      }, {
        value: 3,
        label: '过期'
      }],
      status: '',
      device_options: [{
        value: '',
        label: '全部设备'
      }],
      device: '',

      group_options: [{
        value: '',
        label: '全部系统'
      }],
      group: '',
      search: '',
      time: [],
      timebegin: '',
      timeend: '',

      inhaul_group: '',
      inhaul_device: '',
      inhaul_status: '',
      inhaul_search: '',
      inhaul_page: 1,

      //列表
      partsList: [],
      total: 0,
      total0: '加载中',
    }
  },

  //创建前
  beforeCreate: function() {},

  //创建后
  created: function() {},

  //渲染后
  mounted: function() {
    this.socketOn();
    this.getList_default();
    this.getGroup();
  },

  //方法
  methods: {
    getGroup: function() {
      let that = this;
      setTimeout(function() {
        if (that.$store.state.data.unitlist.length == 0) {
          setTimeout(function() {
            that.getGroup();
            return false;
          }, 500);
        } else {
          let unitlist = that.$store.state.data.unitlist;
          for (let index in unitlist) {
            that.group_options.push({
              value: unitlist[index].name,
              label: unitlist[index].name
            })
          };
        }
      }, 500);
    },
    getDevice: function() {
      let that = this;
      that.device_options = [{
        value: '',
        label: '全部设备'
      }];
      that.device = '';
      let unitlist = that.$store.state.data.unitlist;
      for (let index in unitlist) {
        if (unitlist[index].name == that.inhaul_group) {
          let unitlist_value = unitlist[index].value;
          for (let itme in unitlist_value) {
            that.device_options.push({
              value: unitlist_value[itme].name,
              label: unitlist_value[itme].name,
            })
          }
        }
      };
    },
    getSearch: function() {
      this.getList_inhaul();
    },
    getSort_group: function(val) {
      this.inhaul_group = val;
      this.inhaul_device = '';
      this.getList_inhaul();
      this.getDevice();
    },
    getSort_device: function(val) {
      this.inhaul_device = val;
      this.getList_inhaul();
    },
    getSort_status: function(val) {
      this.inhaul_status = val;
      this.getList_inhaul();
    },
    getPage: function(val) {
      this.inhaul_page = val;
      this.getList_page();
    },
    socketOn: function() {
      let that = this;
      // this.$socket.on('div_check_fault_history', function(data) {
      //   console.log(data);
      // });
    },
    getList_default: function() {
      // this.$socket.emit('div_check_fault_history', {
      //   'args': '',
      //   'page': '',
      // });
    },
    getList_inhaul: function() {
      this.inhaul_page = 1;
      // this.$socket.emit('div_check_fault_history', {
      //   'args': {
      //     // 'unit': this.inhaul_group,
      //     // 'part': this.inhaul_device,
      //     // 'keywords': this.search,
      //     // 'timebegin': this.timebegin,
      //     // 'timeend': this.timeend
      //   },
      //   'page': '',
      // });
      console.log(this.inhaul_group, this.inhaul_device, this.search, this.timebegin, this.timeend);
    },

    //跳转
    gotoPartAdd: function() {
      this.$router.push({
        path: '/parts/partAdd',
      })
    },
  },
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
<style lang="scss" scoped>
div.partView.partVue {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    min-height: 100%;
    background: #eee;
    padding: inherit;
}
</style>
