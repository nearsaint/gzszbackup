<template>
<div>
  <page-title v-bind:title="query_group+query_device"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/devices' }">设备列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{query_group}} - {{query_device}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="statusList">
      <h6>设备状态</h6>
      <ul>
        <li v-bind:class="[this.isrunning ? 'opening' : 'closed']">
          <b></b>
          <h3></h3>
          <h5>设备启停</h5>
        </li>
        <li v-show="this.isrunning" v-bind:class="[this.status ? 'running' : 'warning', this.isrunning ? '' : 'closed']">
          <b></b>
          <h3></h3>
          <h5>设备状态</h5>
        </li>
      </ul>
    </div>
    <div class="propertyList">
      <h6>所属测点列表</h6>
      <div class="inhaul">
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
            <div class="rvalue hidden-xs">
              实时值
            </div>
            <div class="svalue hidden-xs">
              设定值
            </div>
            <div class="edit ">
            </div>
          </div>
        </div>
        <li v-for="(item, index) in propertyList" :key="index" class="animated fadeIn">
          <div class="statusDot">
            <b v-bind:class="(propertyStatus(item.rvalue))"></b>
          </div>
          <div class="main">
            <div class="name">
              <h5>{{item.name}}</h5>
            </div>
            <div class="rvalue" v-bind:class="(propertyStatus(item.rvalue))">
              <h5>{{propertyValueR(item.rvalue)}}</h5>
            </div>
            <div class="svalue">
              <h5>{{propertyValueS(item.svalueh,item.svaluel)}}</h5>
            </div>
            <div class="edit ">
              <el-button type="primary " round @click="gotoProperty(query_group,query_device,item.name,item.svalueh,item.svaluel)">查看测点</el-button>
            </div>
          </div>
        </li>
        <el-pagination v-if="total>10" @current-change="getPage" background layout="prev, pager, next" :total="this.total" :current-page.sync="inhaul_page">
        </el-pagination>
      </ul>
    </div>
  </div>
  <transition name="el-fade-in-linear">
    <router-view class="propertyView"></router-view>
  </transition>
</div>
<!-- end .box -->
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

      //传参
      query_group: '未知系统',
      query_device: '未知设备',

      //引索
      search: '',
      inhaul_search: '',
      inhaul_page: 1,

      //列表
      propertyList: [],
      total: 0,
      total0: '加载中',
      isrunning: 0,
      status: 0,
    }
  },

  beforeCreate: function() {},
  created: function() {
    this.getQuery();
    this.socketOn();
    this.getList_default();
  },
  mounted: function() {},
  //方法
  methods: {

    //路由变化
    routeChange: function() {
      this.getQuery();
      this.getList_default();
      this.search = '';
      this.total0 = '加载中';
    },

    //获取数据
    getQuery: function() {
      this.query_group = this.$route.query.group;
      this.query_device = this.$route.query.device;
    },

    socketOn: function() {
      let that = this;
      this.$socket.on('div_check_single_part', function(data) {
        console.log(data);
        that.propertyList = [];
        that.total0 = '加载中';
        if (data.total >= 0) {
          that.total = data.total;
          if (data.total == 0) {
            that.total0 = '获取不到相应的数据.'
          }
        }
        this.point = that.propertyList.concat(data.point);
        that.propertyList = this.point;
        that.isrunning = data.isrunning;
        that.status = data.status;
      });
    },

    getList_default: function() {
      this.inhaul_page = 1;
      this.$socket.emit('div_check_single_part', {
        'args': {
          'unit': this.query_group,
          'part': this.query_device,
          'keywords': this.search,
        },
        'page': '',
      });
    },

    getList_page: function() {
      this.$socket.emit('div_query_all_parts', {
        "args": '',
        "page": this.inhaul_page - 1,
      });
    },


    //引索
    getSearch: function() {
      this.getList_default();
    },
    getPage: function(val) {
      this.inhaul_page = val - 1;
      this.getList_page()
    },

    //跳转
    gotoProperty: function(group, device, property, vh, vl) {
      this.$router.push({
        path: '/device/' + group + device + '/property/' + property,
        query: {
          group: group,
          device: device,
          property: property,
          vh: vh,
          vl: vl,
        }
      })
    },

    //测点状态判断
    propertyStatus: function(v, vh, vl) {
      if (v) {
        return 'running';
      } else {
        return 'closed';
      }
    },
    propertyValueS: function(vh, vl) {
      if (vh && vl) {
        return vl + '/' + vh;
      } else {
        if (vh) {
          return vh;
        } else if (vl) {
          return vl;
        } else {
          return null;
        }
      }
    },
    propertyValueR: function(v) {
      if (v === 999999) {
        return '开启';
      } else if (Math.abs(v) - 999999 == 0) {
        return '关闭';
      } else {
        return v;
      }
    },

  },
  //监控
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。
  computed: {},
  //组件
  components: {
    pageTitle
  },

  beforeDestroy: function() {
    this.$socket.removeAllListeners('div_check_single_part');
  },

}
</script>
<style lang="scss" scoped>
div.propertyView.propertyVue {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    min-height: 100%;
    background: #eee;
    padding: inherit;
}
div.statusList {
    margin-bottom: 40px;

    > ul {
        display: flex;

        > li {
            width: 280px;
            margin: 10px 20px 10px 0;
            border-radius: 10px;
            background-color: #fff;
            padding: 20px;
            position: relative;

            &.opening {
                background-color: #2ECC71;
                background: -webkit-linear-gradient(top, #2ECC71, #27AE60);
                background: -moz-linear-gradient(top, #2ECC71, #27AE60);
                background: -o-linear-gradient(top, #2ECC71, #27AE60);
                background: linear-gradient(top, #2ECC71, #27AE60);

                > h5 {
                    color: #eee;
                }

                > h3 {
                    color: #fff;

                    &::after {
                        content: '运行';
                    }
                }
            }

            &.running {
                background-color: #2ECC71;
                background: -webkit-linear-gradient(top, #2ECC71, #27AE60);
                background: -moz-linear-gradient(top, #2ECC71, #27AE60);
                background: -o-linear-gradient(top, #2ECC71, #27AE60);
                background: linear-gradient(top, #2ECC71, #27AE60);

                > h5 {
                    color: #eee;
                }

                > h3 {
                    color: #fff;

                    &::after {
                        content: '正常';
                    }
                }
            }

            &.warning {
                background-color: #F1C40F;
                background: -webkit-linear-gradient(top, #F1C40F, #F39C12);
                background: -moz-linear-gradient(top, #F1C40F, #F39C12);
                background: -o-linear-gradient(top, #F1C40F, #F39C12);
                background: linear-gradient(top, #F1C40F, #F39C12);

                > h5 {
                    color: #eee;
                }

                > h3 {
                    color: #fff;

                    &::after {
                        content: '报警';
                    }
                }
            }

            &.closed {
                background-color: #95A5A6;
                background: -webkit-linear-gradient(top, #95A5A6, #7F8C8D);
                background: -moz-linear-gradient(top, #95A5A6, #7F8C8D);
                background: -o-linear-gradient(top, #95A5A6, #7F8C8D);
                background: linear-gradient(top, #95A5A6, #7F8C8D);

                > h5 {
                    color: #eee;
                }

                > h3 {
                    color: #fff;

                    &::after {
                        content: '关闭';
                    }
                }
            }

            > b {
                display: none;
                height: 100%;
                width: 8px;
                background: #ccc;
                border-radius: 10px;
            }

            > h5 {
                font-size: 14px;
                color: #ccc;
            }

            > h3 {
                font-size: 24px;
                color: #444;
                margin-bottom: 10px;
            }
        }
    }
}
div.propertyList {
    > h6 {
        margin-bottom: 10px;
    }
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
            h6 {
                display: inline-block;
                font-size: 14px;
                line-height: 40px;
                color: #999;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .status {
                &.running {
                    h5 {
                        color: #67C23A;
                        &:after {
                            content: '正常';
                        }
                    }
                }
                &.warning {
                    h5 {
                        color: #E6A23C;
                    }
                    &.warningH {
                        h5:after {
                            content: '超过设定值';
                        }
                    }
                    &.warningL {
                        h5:after {
                            content: '低于设定值';
                        }
                    }
                }
                &.closed {
                    h5 {
                        color: #999;
                        &:after {
                            content: '关闭';
                        }
                    }
                }
            }
            .rvalue {
                &.running {
                    h5 {
                        color: #67C23A;
                    }
                    h6 {
                        color: #67C23A;
                    }
                }
                &.warning {
                    h5 {
                        color: #E6A23C;
                    }
                    h6 {
                        color: #E6A23C;
                    }
                }
                &.closed {
                    h5 {
                        color: #999;
                    }
                    h6 {
                        color: #999;
                    }

                }
            }

            //>li{
            @media (max-width: 992px) {
                h5 {
                    display: block;
                    line-height: 20px;
                    margin-right: 0;
                    margin-bottom: 5px;
                }
                h6 {
                    display: block;
                    line-height: 20px;
                    color: #999;
                }
            }
            //>li{
            @media (max-width: 768px) {

                .main {
                    flex-wrap: wrap;
                    > .name {
                        width: 100%;
                        h5 {
                            display: block;
                            line-height: 20px;
                            margin-right: 0;
                            margin-bottom: 5px;
                        }
                        h6 {
                            display: block;
                            line-height: 20px;
                            color: #999;
                            margin-bottom: 5px;
                        }
                    }
                    > .status {
                        width: 100%;
                        h5 {
                            display: inline-block;
                            line-height: 20px;
                            margin-right: 5px;
                            margin-bottom: 0;
                            font-size: 14px;
                        }
                        h6 {
                            display: inline-block;
                            line-height: 20px;
                        }
                    }
                    > .edit {
                        right: 0;

                    }
                }
            }
            &:hover {
                .edit {
                    right: 0;
                }
            }
        }
        .statusDot {
            width: 62px;
            text-align: center;
            > b {
                display: block;
                background: #999;
                width: 10px;
                height: 100%;
                margin: 0 auto;
                border-radius: 10px;
                &.running {
                    background-color: #67C23A;
                }
                &.warning {
                    background-color: #E6A23C;
                }
                &.closed {
                    background-color: #999 !important;
                }
            }
        }
        .main {
            width: calc(100% - 62px);
            display: flex;
            position: relative;
            overflow: hidden;
            > .name {
                width: 30%;
            }
            > .rvalue {
                width: 30%;
            }
            > .svalue {
                width: 40%;
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
