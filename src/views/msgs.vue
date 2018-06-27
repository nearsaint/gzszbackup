<template>
<div>
  <page-title v-bind:title="'报警信息'"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报警信息</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="msgsList">
      <div class="inhaul">
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
          <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']" @change="getSort_time">
          </el-date-picker>
        </div>
        <div class="search">
          <el-input v-model="search" placeholder="请输入您要找的关键字" suffix-icon="el-icon-search" clearable @change="getSearch">
          </el-input>
        </div>
      </div>
      <h5 v-if="total==0">{{total0}}</h5>
      <ul class="list" v-show="total>0">
        <div class="title ">
          <div class="main ">
            <div class="device">
              设备名
            </div>
            <div class="group">
              所属系统
            </div>
            <div class="time">
              故障时间
            </div>
            <div class="edit ">
            </div>
          </div>
        </div>
        <li v-for="(item, index) in msgsList" :key="index" class="animated fadeIn">

          <div class="main">
            <div class="device">
              <h5>{{item.part}}</h5>
            </div>
            <div class="group">
              <h5>{{item.unit}}</h5>
            </div>
            <div class="time">
              <h5>{{item.datetime}}</h5>
            </div>
            <div class="edit ">
              <el-button type="primary " round @click="gotoDevice(item.unit,item.name)">查看故障时参数</el-button>
            </div>
          </div>
        </li>
        <el-pagination v-if="total>10" @current-change="getPage" background layout="prev, pager, next" :total="this.total" :current-page.sync="inhaul_page">
        </el-pagination>
      </ul>
    </div>
  </div>
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
      inhaul_search: '',
      inhaul_page: 1,

      //列表
      msgsList: [],
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
              value: unitlist[index].unit,
              label: unitlist[index].unit
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
        if (unitlist[index].unit == that.inhaul_group) {
          let unitlist_parts = unitlist[index].parts;
          for (let itme in unitlist_parts) {
            that.device_options.push({
              value: unitlist_parts[itme].part,
              label: unitlist_parts[itme].part,
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
    getSort_time: function(val) {
      this.time = val;
      if (!this.time) {
        this.timebegin = '';
        this.timeend = '';
      } else {
        this.timebegin = val[0] + ' 00:00:00';
        this.timeend = val[1] + ' 00:00:00';
      }
      this.getList_inhaul();
    },
    getPage: function(val) {
      this.inhaul_page = val;
      this.getList_page();
    },


    socketOn: function() {
      let that = this;
      this.$socket.on('div_check_fault_history', function(data) {
        console.log(data);
        that.msgsList = [];
        that.total = 0;
        that.total0 = '加载中';
        if (data.total >= 0) {
          that.total = data.total;
          if (data.total == 0) {
            that.total0 = '获取不到相应的数据.'
          }
        };
        this.value = that.msgsList.concat(data.value);
        that.msgsList = this.value;
      });
    },
    getList_default: function() {
      this.$socket.emit('div_check_fault_history', {
        'args': '',
        'page': '',
      });
    },
    getList_inhaul: function() {
      this.inhaul_page = 1;
      this.$socket.emit('div_check_fault_history', {
        'args': {
          'unit': this.inhaul_group,
          'part': this.inhaul_device,
          'keywords': this.search,
          'timebegin': this.timebegin,
          'timeend': this.timeend
        },
        'page': '',
      });
      console.log(this.inhaul_group, this.inhaul_device, this.search, this.timebegin, this.timeend);
    },
    getList_page: function() {
      this.$socket.emit('div_check_fault_history', {
        "args": '',
        "page": this.inhaul_page - 1,
      });
    },

    gotoDevice: function(group, device) {
      this.$router.push({
        path: '/device/' + group + device,
        query: {
          group: group,
          device: device
        }
      })
    },
  },
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会触发实时计算。
  computed: {},
  //监控
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': ' '
  }, //组件
  components: {
    pageTitle
  },
  beforeDestroy: function() {
    this.$socket.removeAllListeners('div_check_fault_history');
  },
}
</script>
<style lang="scss" scoped>
div.msgsList {
    > h5 {
        font-size: 14px;
        color: #666;
        text-align: left;
        margin: 40px 40px 40px 10px;
    }
    ul.list {
        div.title {
            display: flex;
        }
        > div {
            color: #999;
            font-size: 12px;
            margin-bottom: 5px;
        }
        > li {
            width: 100%;
            background: #fff;
            display: flex;
            border-radius: 10px;
            padding: 20px 0;
            margin-bottom: 10px;
            transition: border-color 0.3s;
            border: 1px solid #fff;
            &:hover {
                border-color: #409EFF;
            }
            > div {
                display: flex;
            }
            h5 {
                display: inline-block;
                font-size: 20px;
                line-height: 40px;
                margin-right: 5px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            //>li{
            @media (max-width: 992px) {
                h5 {
                    display: block;
                    line-height: 20px;
                    margin-right: 0;
                    font-size: 16px;
                }
                .main {}
            }
            //>li{
            @media (max-width: 768px) {

                .main {
                    flex-wrap: wrap;
                    > .device,
                    > .group {
                        width: 100%;
                        h5 {
                            display: block;
                            line-height: 20px;
                            margin-right: 0;
                            margin-bottom: 5px;
                        }
                    }
                    > .time {
                        width: 100%;
                        h5 {
                            display: inline-block;
                            line-height: 20px;
                            margin-right: 5px;
                            margin-bottom: 0;
                            font-size: 14px;
                        }
                    }
                }
            }
            &:hover {
                .edit {
                    right: 0;
                }
            }
        }
        .main {
            width: 100%;
            padding: 0 40px;
            display: flex;
            position: relative;
            overflow: hidden;
            > .device {
                width: 15%;
            }
            > .group {
                width: 15%;
            }
            > .time {
                width: 70%;
            }
            > .edit {
                width: auto;
                text-align: right;
                padding: 0 11px;
                position: absolute;
                top: 50%;
                margin-top: -20px;
                right: -200px;
                transition: right 0.3s;
            }
        }
    }
}
</style>
