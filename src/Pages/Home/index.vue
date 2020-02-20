<template>
  <div class="home-page" v-if="loaded">
    <div class="btn-box">
      <el-button type="primary" @click="handleCrowllerClick">
        爬取
      </el-button>
      <el-button type="primary">展示</el-button>
      <el-button type="primary" @click="handleLogoutCick">
        退出
      </el-button>
    </div>
    <div id="myEcharts" style="height:400px"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '../../request'
import moment from 'dayjs'
import { Button } from 'element-ui'
import echarts from 'echarts'
interface CourseItem {
  title: string
  count: number
}
interface DataStructure {
  [key: string]: CourseItem[]
}
interface LineData {
  name: string
  type: string
  data: number[]
}

Vue.use(Button)

@Component
export default class extends Vue {
  private loaded = false
  private options: object = {}
  private handleLogoutCick() {
    request.get('/api/logout').then(res => {
      const data: DataStructure = res.data
      if (data) {
        this.$router.push('login')
      } else {
        this.$message.error('退出失败')
      }
    })
  }
  private handleCrowllerClick() {
    request.get('/api/getData').then(res => {
      const data: DataStructure = res.data
      if (data) {
        this.$message.success('爬取成功')
        this.getShowData()
      } else {
        this.$message.error('爬取失败')
      }
    })
  }
  private getShowData() {
    request.get('/api/showData').then(res => {
      const data: DataStructure = res.data
      if (data) {
        const courseNames: string[] = []
        const times: string[] = []
        const tempData: {
          [key: string]: number[]
        } = {}

        for (const key in data) {
          const item = data[key]
          times.push(moment(Number(key)).format('MM-DD HH:mm'))
          item.forEach(innerItem => {
            const { title, count } = innerItem
            if (!courseNames.includes(title)) {
              courseNames.push(title)
            }
            tempData[title]
              ? tempData[title].push(count)
              : (tempData[title] = [count])
          })
        }
        const result: LineData[] = []
        for (const i in tempData) {
          result.push({
            name: i,
            type: 'line',
            data: tempData[i]
          })
        }
        this.options = {
          title: {
            text: '课程在线人数'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: courseNames
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: times
          },
          yAxis: {
            type: 'value'
          },
          series: result
        }
        const element = document.getElementById('myEcharts') as HTMLDivElement
        const chart = echarts.init(element)
        // 调接口获取数据
        chart.setOption(this.options)
      }
    })
  }

  mounted() {
    request.get('/api/isLogin').then(res => {
      const data: boolean = res.data
      if (!data) {
        this.$router.push('login')
      } else {
        this.loaded = true
        this.getShowData()
      }
    })
  }
}
</script>

<style scoped>
.home-page {
  padding: 50px;
  margin: 100px auto;
  border: 1px solid #ddd;
}
.btn-box {
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}
</style>
