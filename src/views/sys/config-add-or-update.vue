<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="参数名" prop="paramKey">
        <el-input v-model="dataForm.paramKey" placeholder="参数名" />
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="参数值" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { configInfo, configSaveOrUpData } from '@/api/sys/config'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        paramKey: '',
        paramValue: '',
        remark: ''
      },
      dataRule: {
        paramKey: [
          { required: true, message: '参数名不能为空', trigger: 'blur' }
        ],
        paramValue: [
          { required: true, message: '参数值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          configInfo(this.dataForm.id).then((res) => {
            if (res && res.code === 200) {
              this.dataForm.paramKey = res.data.paramKey
              this.dataForm.paramValue = res.data.paramValue
              this.dataForm.remark = res.data.remark
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const type = !this.dataForm.id ? 'save' : 'update'
          const data = {
            'id': this.dataForm.id || undefined,
            'paramKey': this.dataForm.paramKey,
            'paramValue': this.dataForm.paramValue,
            'remark': this.dataForm.remark
          }

          configSaveOrUpData(type, data).then(res => {
            if (res && res.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>
