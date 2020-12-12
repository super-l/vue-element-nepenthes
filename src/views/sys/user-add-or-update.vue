<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" />
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { userInfo2, userSaveOrUpData } from '@/api/sys/user'
import { roleSelect } from '@/api/sys/role'
import { isEmail, isMobile } from '@/utils/validate'

export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: '',
        password: '',
        comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1
      },
      dataRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0

      roleSelect().then((res) => {
        this.roleList = res && res.code === 200 ? res.data : []
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          userInfo2(this.dataForm.id).then((res) => {
            if (res && res.code === 200) {
              this.dataForm.userName = res.data.username
              this.dataForm.salt = res.data.salt
              this.dataForm.email = res.data.email
              this.dataForm.mobile = res.data.mobile
              this.dataForm.roleIdList = res.data.roleIdList
              this.dataForm.status = res.data.status
            }
          })
        }
      })
    },

    // 表单提交
    dataFormSubmit() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const type = !this.dataForm.id ? 'save' : 'update'
          const data = {
            'userId': this.dataForm.id || undefined,
            'username': this.dataForm.userName,
            'password': this.dataForm.password,
            'salt': this.dataForm.salt,
            'email': this.dataForm.email,
            'mobile': this.dataForm.mobile,
            'status': this.dataForm.status,
            'roleIdList': this.dataForm.roleIdList
          }

          userSaveOrUpData(type, data).then(function(res) {
            if (res && res.code === 200) {
              that.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  that.visible = false
                  that.$emit('refreshDataList')
                }
              })
            } else {
              that.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>
