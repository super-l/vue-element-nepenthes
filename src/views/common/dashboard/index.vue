<template>
  <div class="dashboard-container">

    <panel-group @handleSetLineChartData="cardData" />

    {{ message }}

    <div class="mod-home">
      <h3>项目介绍</h3>
      <ul>
        <li>本项目基于vue、element-ui构建开发，实现后台管理前端功能，提供一套更优的前端解决方案</li>
        <li>前后端分离，通过token进行数据交互，可独立部署</li>
        <li>主题定制，通过scss变量统一一站式定制</li>
        <li>动态菜单，通过菜单管理统一管理访问路由</li>
        <li>数据切换，通过mock配置对接口数据／mock模拟数据进行切换</li>
      </ul>
      <h3>忘忧草团队官方QQ群</h3>
      <ul>
        <li>官方群1：50246933</li>
        <li>官方店铺：https://shop73033248.taobao.com/</li>
      </ul>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
      cardData: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      message: ''
    }
  }
}
</script>

<style>
.dashboard-container{
  background-color: rgb(240, 242, 245);
  position: relative;
  height: 100%;
}

.app-main{
  background-color: rgb(240, 242, 245);
}

.mod-home {
  line-height: 1.5;
}

.mod-home ul li{
  list-style-type: disc;
}
</style>
