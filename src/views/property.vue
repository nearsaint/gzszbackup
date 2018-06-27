<template>
<div class="propertyVue">
  <page-title v-bind:title="query_group+query_device+query_property"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/devices' }">设备列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/device/'+this.$route.query.group+this.$route.query.device, query:{group: this.$route.query.group,device: this.$route.query.device} }">{{query_group}} - {{query_device}} </el-breadcrumb-item>
      <el-breadcrumb-item>{{query_property}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="statusList">
      <h6>设备状态</h6>
      <ul>
        <li v-bind:class="propertyStatus(this.query_v)">
          <h3>{{query_v}}</h3>
          <h5>当前值</h5>
        </li>
        <li v-if="query_vh">
          <h3>{{query_vh}}</h3>
          <h5>设定值</h5>
        </li>
        <li v-if="query_vl">
          <h3>{{query_vl}}</h3>
          <h5>设定值</h5>
        </li>
      </ul>
    </div>
    <div class="DBview">
      <div class="box">
        <div class="title">
          <h5>实时数据曲线</h5>
          <el-button type="primary" round>曲线详情</el-button>
        </div>
        <div class="content">
          <div class="DBcontainer">
            <div class="chart" id="myChart">
            </div>
          </div>
          <!-- end .DBcontainer -->
        </div>
      </div>
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
      query_device: '未知设备',
      query_property: '未知测点',
      query_vh: null,
      query_vl: null,
      query_v: null,

      Chart_data: [],
      Chart_date: [],
      Chart_lenght: 20,
      echart: '',
    }
  },
  created: function() {
    this.getQuery();
    this.socketOn();
  },
  mounted: function() {
    this.createChart();
    this.getData_default();
  },
  beforeDestroy: function() {
    this.$socket.removeAllListeners('div_check_point_data');
  },
  methods: {

    //路由变化
    routeChange: function() {
      this.getQuery();
      this.getData_default();
    },

    //获取数据
    getQuery: function() {
      this.query_group = this.$route.query.group;
      this.query_device = this.$route.query.device;
      this.query_property = this.$route.query.property;
      this.query_vh = this.$route.query.vh;
      this.query_vl = this.$route.query.vl;
    },
    socketOn: function() {
      let that = this;
      this.$socket.on('div_check_point_data', function(data) {
        console.log(data);
        this.date = that.Chart_date.concat(data.datetime);
        this.data = that.Chart_data.concat(data.value);
        that.Chart_date = this.date;
        that.Chart_data = this.data;
        that.query_v = that.Chart_data[that.Chart_data.length - 1];
        if (that.Chart_data.length > that.Chart_lenght) {
          this.data.shift();
          this.date.shift();
        }
        that.refreshData();
      });
    },
    getData_default: function() {
      this.$socket.emit('div_check_point_data', {
        "args": {
          "unit": "其他",
          "part": "低压柜1",
          "point": "电流C"
        }
      });
    },

    createChart: function() {
      this.echart = this.$echarts.init(document.getElementById('myChart'));
      this.echart.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          show: true,
          right: 20,
          bottom: 15,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {
              show: false,
              readOnly: false
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: [this.query_property],
          left: 20,
          bottom: 15,
        },
        grid: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 60,
        },
        xAxis: {
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: false
          },
          data: this.Chart_date
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
        },
        series: [{
          name: this.query_property,
          type: 'line',
          smooth: true,
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#3498DB'
              }, {
                offset: 1,
                color: '#2980B9'
              }])
            }
          },
          itemStyle: {
            normal: {
              color: '#409EFF'
            }
          },
          markLine: {
            silent: true,
            data: [{
              yAxis: this.query_vh
            }, {
              yAxis: this.query_vl
            }]
          },
          data: this.Chart_data
        }]
      });
    },
    refreshData: function() {
      this.echart.setOption({
        xAxis: {
          data: this.Chart_date
        },
        series: [{
          data: this.Chart_data
        }]
      });
    },

    //测点状态判断
    propertyStatus: function(v) {
      if (v) {
        return 'running';
      } else {
        return 'closed';
      }
    },
  },
  //监控
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange',
  },
  //computed相当于属性的一个实时计算，如果实时计算里关联了对象，那么当对象的某个值改变的时候，同事会出发实时计算。

  //组件
  components: {
    pageTitle,
  },
}
</script>
<style lang="scss" scoped>
div.statusList {
    margin-bottom: 40px;

    > ul {
        display: flex;
        flex-wrap: wrap;

        > li {
            width: 280px;
            margin: 10px 20px 10px 0;
            border-radius: 10px;
            background-color: #fff;
            padding: 20px;
            position: relative;

            h3 {
                height: 24px;
            }

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
                        content: '无数据';
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
        //>ul{
        @media (max-width: 768px) {
            width: 100%;
            > li {
                width: 100%;
                margin-right: 0;
            }
        }
    }
}
</style>
