<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="main" style="height: 400px;width: 1000px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import http from '../../http/index.js'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    http.get('getEacharts', res => {
      console.log(res.status)
      if (res.status !== 200) return this.$message.error('获取图表数据失败!')

      const data = _.merge(res.data.data, this.options)

      myChart.setOption(data)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>