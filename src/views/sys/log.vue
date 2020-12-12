<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"
      />
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="用户操作"
      />
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求方法"
      />
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求参数"
      />
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="执行时长(毫秒)"
      />
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址"
      />
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      />
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </div>
</template>

<script>
import { logList } from '@/api/sys/log'
export default {
  data() {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      const that = this
      this.dataListLoading = true

      const params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'key': this.dataForm.key
      }
      logList(params).then(function(res) {
        if (res && res.code === 200) {
          that.dataList = res.data.list
          that.totalPage = res.data.totalCount
        } else {
          that.dataList = []
          that.totalPage = 0
        }
        that.dataListLoading = false
      })
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },

    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>
