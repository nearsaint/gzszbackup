<template>
<div>
  <page-title v-bind:title="query_group+'总览'"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{query_group}}系统总览</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="devicesList">
      <h6>所属设备列表</h6>
      <div class="inhaul">
        <div class="sort">
          <el-select v-model="openClose" placeholder="全部启停" @change="getSort_openClose">
            <el-option v-for="item in openClose_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sort">
          <el-select v-model="status" placeholder="全部状态" @change="getSort_status">
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
        <li v-for="(item, index) in devicesList" :key="index" class="animated fadeIn">
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
      query_group: '未知系统',

      //引索状态
      openClose_options: [{
        value: '',
        label: '全部启停'
      }, {
        value: '1',
        label: '运行'
      }, {
        value: '0',
        label: '关闭'
      }, ],
      openClose: '',
      status_options: [{
          value: '',
          label: '全部状态'
        },
        {
          value: '1',
          label: '正常'
        }, {
          value: '0',
          label: '报警'
        },
      ],
      status: '',

      search: '',

      inhaul_status: '',
      inhaul_openClose: '',
      inhaul_search: '',
      inhaul_page: 1,

      //列表
      devicesList: [],
      total: 0,
      total0: '加载中',
    }
  },
  created: function() {
    this.getQuery();
  },
  mounted: function() {
    this.socketOn();
    this.getList_default();
  },
  methods: {
    //路由变化
    routeChange: function() {
      this.getQuery();
      this.getList_default();
      this.search = '';
      this.total0 = '加载中';
    },

    getQuery: function() {
      this.query_group = this.$route.query.group;
    },
    getSearch: function() {
      this.getList_inhaul();
    },
    getPage: function(val) {
      this.inhaul_page = val;
      this.getList_page()
    },
    getSort_openClose: function(val) {
      this.inhaul_openClose = val;
      this.getList_inhaul();
    },
    getSort_status: function(val) {
      this.inhaul_status = val;
      this.getList_inhaul();
    },

    socketOn: function() {
      let that = this;
      this.$socket.on('div_query_all_parts', function(data) {
        that.devicesList = [];
        that.total = 0;
        that.total0 = '加载中';
        console.log(data);
        if (data.total >= 0) {
          that.total = data.total;
          if (data.total == 0) {
            that.total0 = '获取不到相应的数据.'
          }
        }
        this.parts = that.devicesList.concat(data.parts);
        that.devicesList = this.parts;
      });
    },
    getList_default: function() {
      this.$socket.emit('div_query_all_parts', {
        'args': {
          'isrunning': '',
          'status': '',
          'unit': this.query_group,
          'keywords': '',
        },
        'page': '',
      });
    },
    getList_inhaul: function() {
      this.inhaul_page = 1;
      this.$socket.emit('div_query_all_parts', {
        'args': {
          'isrunning': this.inhaul_openClose,
          'status': this.inhaul_status,
          'unit': this.query_group,
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
    gotoDevice: function(group, device) {
      this.$router.push({
        path: '/device/' + group + device,
        query: {
          group: group,
          device: device
        }
      })
    }
  },
  beforeDestroy: function() {
    console.log('group.vue well destroyed');
    this.$socket.removeAllListeners('div_query_all_parts');
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
}
</script>
<style lang="scss" scoped>
div.devicesList {
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
                            content: '运行';
                        }
                    }
                    h6 {
                        color: #67C23A;
                        &:after {
                            content: '正常';
                        }
                    }
                }
                &.warning {
                    h5 {
                        color: #E6A23C;
                        &:after {
                            content: '运行';
                        }
                    }
                    h6 {
                        color: #E6A23C;
                        &:after {
                            content: '报错';
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
                width: 50%;
            }
            > .status {
                width: 50%;
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
