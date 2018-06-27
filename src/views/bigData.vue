<template>
<div>
  <page-title v-bind:title="'详细数据'"></page-title>
  <div class="bread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>详细数据</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <hr class="underBread">
  <div class="mainContainer">
    <div class="timer">
      <h6>时间</h6>
      <div class="inhaul">
        <div class="sort">
          <el-date-picker v-model="time" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']" @change="getSort_time">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="propertyer">
      <h6>测点</h6>
      <div class="propertys">
        <div class="property" v-for="(item,index) in propertys" :key="index">
          {{item.group}}-{{item.device}}-{{item.property}}
          <a @click="property_del(index)"><i class="fa fa-close"></i></a>
        </div>
        <el-button type="primary" icon="el-icon-plus" plain @click="dialogVisible = true">添加参数曲线</el-button>
      </div>
    </div>
    <div class="tiper">
      <h6>曲线辅助</h6>
      <div class="tiperbox">
        <div class="">
          <h5>最大值提示</h5>
          <el-switch v-model="chart_max_opening" @change="chartMax">
          </el-switch>
        </div>
        <div class="">
          <h5>最小值提示</h5>
          <el-switch v-model="chart_min_opening" @change="chartMin">
          </el-switch>
        </div>
        <div class="">
          <h5>平均提示</h5>
          <el-switch v-model="chart_average_opening" @change="chartAverage">
          </el-switch>
        </div>
        <div class="">
          <h5>设定值提示</h5>
          <el-switch v-model="chart_svalue_opening">
          </el-switch>
        </div>

      </div>
    </div>
    <div class="DBview">
      <div class="box">
        <div class="title">
          <h5>数据曲线</h5>
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

  <el-dialog title="添加数据曲线" :visible.sync="dialogVisible" width="50%" append-to-body>
    <span>
      <el-select v-model="group" placeholder="请选择系统" @change="getSort_group">
        <el-option v-for="item in group_options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
        <el-select v-model="device" placeholder="请选择设备" @change="getSort_device">
          <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
          <el-select v-model="property" placeholder="请选择测点">
            <el-option v-for="item in property_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="property_add()">确 定</el-button>
    </span>
  </el-dialog>
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
      device_options: [],
      device: '',
      group_options: [],
      group: '',
      property_options: [],
      property: '',
      time: [],
      timebegin: '',
      timeend: '',
      unit: [],
      part: [],
      point: [],
      propertys: [],
      dialogVisible: false,

      chart_x: [],
      chart_legend: [],
      chart_server: [],
      chart_max_opening: false,
      chart_max: '',
      chart_min_opening: false,
      chart_min: '',
      chart_average_opening: false,
      chart_average: false,
      chart_svalue_opening: false,
      chart_svalue: '',
    }
  },



  //创建前
  beforeCreate: function() {},

  //创建后
  created: function() {},

  //渲染后
  mounted: function() {
    this.socketOn();
    this.getGroup();
    this.createChart();
  },

  //方法
  methods: {

    //添加
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
      that.device_options = [];
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
    getProperty: function() {
      let that = this;
      that.property_options = [];
      that.property = '';
      let unitlist = that.$store.state.data.unitlist;
      for (let index in unitlist) {
        if (unitlist[index].unit == that.inhaul_group) {
          let unitlist_parts = unitlist[index].parts;
          for (let item in unitlist_parts) {
            if (unitlist_parts[item].part == that.inhaul_device) {
              let unitlist_points = unitlist_parts[item].points;
              for (let i in unitlist_points) {
                that.property_options.push({
                  value: unitlist_points[i],
                  label: unitlist_points[i],
                });
              };
            };
          };
        };
      };
    },
    getSort_group: function(val) {
      this.inhaul_group = val;
      this.inhaul_device = '';
      this.getDevice();
    },
    getSort_device: function(val) {
      this.inhaul_device = val;
      this.inhaul_property = '';
      this.getProperty();
    },
    getSort_time: function(val) {
      this.time = val;
      if (!this.time) {
        this.timebegin = '';
        this.timeend = '';
      } else {
        this.timebegin = val[0] + ' 00:00:00';
        this.timeend = val[1] + ' 00:00:00';
      };
      this.getData();
    },
    property_add: function() {
      this.propertys.push({
        group: this.group,
        device: this.device,
        property: this.property,
      });
      this.dialogVisible = false;
      this.getData();
    },
    property_del: function(index) {
      this.propertys.splice(index, 1);
      this.getData();
    },

    socketOn: function() {
      let that = this;
      this.$socket.on('div_check_point_history', function(data) {
        console.log(data);
        console.log(that.unit, that.part, that.point, that.timebegin, that.timeend)

        let series = [];
        that.chart_x = data.datetime;
        that.Chart_setOption_xaxis(that.chart_x);
        for (let i = 0; i < data.value.length; i++) {
          series.push({
            group: that.unit[i],
            device: that.part[i],
            property: that.point[i],
            value: data.value[i]
          });
        };
        console.log(series);
      });
    },
    getArgs: function() {
      let list = this.propertys;
      this.unit = [];
      this.part = [];
      this.point = [];
      for (let i in list) {
        this.unit.push(list[i].group);
        this.part.push(list[i].device);
        this.point.push(list[i].property);
      }
    },
    getData: function() {
      this.getArgs();
      this.$socket.emit('div_check_point_history', {
        'args': {
          'unit': this.unit,
          'part': this.part,
          'point': this.point,
          'timebegin': this.timebegin,
          'timeend': this.timeend
        },
      });
    },


    createChart: function() {
      this.echart = this.$echarts.init(document.getElementById('myChart'));
      this.Chart_setOption_default();
    },

    chartMax: function(val) {
      console.log(val);
      if (val) {
        this.chart_max = {
          type: 'max',
          name: '最大值'
        };
      } else {
        this.chart_max = '';
      }
      this.Chart_setOption();
    },
    chartMin: function(val) {
      console.log(val);
      if (val) {
        this.chart_min = {
          type: 'min',
          name: '最小值'
        };
      } else {
        this.chart_min = '';
      }
      this.Chart_setOption();
    },
    chartAverage: function(val) {
      console.log(val);
      if (val) {
        this.chart_average = {
          type: 'average',
          name: '平均值'
        };
      } else {
        this.chart_average = '';
      }
      this.Chart_setOption();
    },

    Chart_setOption_default: function() {
      let Chart_option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '40px',
          right: '20%',
          bottom: '60px',
          top: '60px',
          containLabel: true
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '20px',
          top: '60px',
        },
        toolbox: {
          show: true,
          left: '81%',
          top: '0px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {
              readOnly: false
            },
            magicType: {
              type: ['line', 'bar']
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
      };
      this.echart.setOption(Chart_option);
    },
    Chart_setOption_xaxis: function(data) {
      let Chart_option = {
        xAxis: {
          data: data,
        },
      };
      this.echart.setOption(Chart_option);
    },
    Chart_setOption_series: function(data) {
      let Chart_option = {
        legend: {
          data: data.legend
        },
        series: data.series,
      };
      this.echart.setOption(Chart_option);
    },
    // Chart_setOption: function() {
    //   let Chart_option = {
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'cross'
    //       }
    //     },
    //     legend: {
    //       type: 'scroll',
    //       orient: 'vertical',
    //       right: '20px',
    //       top: '60px',
    //       data: ['邮件营销']
    //     },
    //     grid: {
    //       left: '40px',
    //       right: '20%',
    //       bottom: '60px',
    //       top: '60px',
    //       containLabel: true
    //     },
    //     toolbox: {
    //       show: true,
    //       left: '81%',
    //       top: '0px',
    //       feature: {
    //         dataZoom: {
    //           yAxisIndex: 'none'
    //         },
    //         dataView: {
    //           readOnly: false
    //         },
    //         magicType: {
    //           type: ['line', 'bar']
    //         },
    //         restore: {},
    //         saveAsImage: {}
    //       }
    //     },
    //     xAxis: {
    //       type: 'category',
    //       boundaryGap: false,
    //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     dataZoom: [{
    //         show: true,
    //         realtime: true,
    //         start: 0,
    //         end: 100
    //       },
    //       {
    //         type: 'inside',
    //         realtime: true,
    //         start: 0,
    //         end: 100
    //       }
    //     ],
    //     series: [{
    //       name: '邮件营销',
    //       type: 'line',
    //       smooth: true,
    //       data: [11, 11, 15, 13, 12, 13, 10],
    //       markPoint: {
    //         data: [this.chart_max, this.chart_min]
    //       },
    //       // markLine: {
    //       //   data: [this.chart_average]
    //       // },
    //     }],
    //   };
    //   // console.log(this.chart_x, this.chart_server);
    //   // console.log(Chart_option.series[0].data);
    //   // console.log(Chart_option.series[0].markLine.data);
    //   this.echart.setOption(Chart_option);
    // }
  },
  computed: {},
  watch: {},
  components: {
    pageTitle,
  },
  beforeDestroy: function() {},
}
</script>
<style lang="scss" scoped>
div.timer {
    > h6 {
        margin-bottom: 10px;
    }
}
div.propertyer {
    margin-bottom: 20px;

    > h6 {
        margin-bottom: 10px;
    }
    > .propertys {
        display: flex;
        flex-wrap: wrap;
        > .property {
            color: #fff;
            padding: 0 50px 0 20px;
            line-height: 40px;
            border-radius: 50px;
            background-color: #409EFF;
            position: relative;
            margin-right: 20px;
            > a {
                position: absolute;
                right: 5px;
                top: 5px;
                height: 30px;
                width: 30px;
                display: block;
                line-height: 30px;
                text-align: center;
                border-radius: 50%;
                &:hover {
                    background-color: #C0392B;
                }
            }
        }
    }

}
div.tiper {

    margin-bottom: 20px;
    > h6 {
        margin-bottom: 10px;
    }
    > .tiperbox {

        display: flex;
        flex-wrap: wrap;
        > div {
            width: 240px;
            background-color: #fff;
            border-radius: 10px;
            margin: 0 20px 20px 0;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > h5 {
                line-height: 42px;
                display: inline-block;
            }
        }
    }
}
.el-dialog__wrapper {
    z-index: 999999 !important;
}
.DBcontainer {
    height: 600px !important;
    padding: 40px 20px !important;
    > div.chart {
        top: 40px !important;
        left: 20px !important;
        width: calc(100% - 40px) !important;
        height: calc(100% - 80px) !important;
    }
}
</style>
