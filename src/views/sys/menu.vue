<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="menuId"
      border
      style="width: 100%; "
    >
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="名称"
      />
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.parentName" size="small">无</span>
          <span v-else-if="scope.row.parentName" size="small">{{scope.row.parentName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="icon"
        header-align="center"
        align="center"
        label="图标"
      >
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.icon" size="small">无</el-tag>
          <el-tag v-else-if="scope.row.icon" size="small">{{scope.row.icon}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号"
      />
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      />

      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.perms" size="small">无</span>
          <span v-else-if="scope.row.perms" size="small">{{scope.row.perms}}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import { menuList, menuDelete } from '@/api/sys/menu'
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'

export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
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

      menuList().then(function(res) {
        if (res && res.code === 200) {
          that.dataList = treeDataTranslate(res.data, 'menuId')
        }
        that.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      const that = this
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuDelete(id).then(function(res) {
          if (res && res.code === 200) {
            that.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                that.getDataList()
              }
            })
          } else {
            that.$message.error(res.data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
