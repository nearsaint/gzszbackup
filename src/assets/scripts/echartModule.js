//提示工具
export const setting_tooltip_min = {
  trigger: 'axis',
  confine: true,
  axisPointer: {
    type: 'cross'
  }
};
//右上角工具栏配置
export const setting_toolbox_min = {
  show: true,
  right: 10,
  top: 0,
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
};

//图标窗口相对父类容器位置
export const setting_grid_min = {
  top: 40,
  right: 0,
  left: 0,
  bottom: 0,
};

//Y轴
export const setting_yaxis_min = {
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
    show: false
  },
  splitLine: {
    show: false
  },
};

//曲线色
export const setting_itemStyle_min = {
  normal: {
    color: '#333'
  }
};
export const setting_areaStyle_min = {
  normal: {
    color: {
      offset: 0,
      color: '#3498DB'
    }
  }
};