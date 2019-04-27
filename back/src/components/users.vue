<template>
  <div>
    <!--面包屑-->
    <breadcrumb nm="用户" tp="列表"></breadcrumb>
    <!--卡片区-->
    <el-card class="box-card">
      <!--搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getUsersData()" @keydown.enter.native="getUsersData()" placeholder="请输入内容"
                    v-model="usersDataParams.query">
            <el-button slot="append" icon="el-icon-search" @click="getUsersData()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserFormBox = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="usersData" border stripe>
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column prop="username" label="用户名" width="320"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="320"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="320"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="90">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(info.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(info.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersDataParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
      <!--添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addUserFormBox">
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserFormBox = false">取 消</el-button>
          <el-button type="primary" @click="submitAddUserForm">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改用户对话框-->
      <el-dialog title="修改用户" :visible.sync="editUserFormBox">
        <el-form :model="editUserForm" :rules="editUserRules" ref="editUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserFormBox = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUserForm(editUserForm.id)">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersData()
  },
  data() {
    return {
      usersDataParams: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      usersData: [],
      totalPage: 0,
      addUserFormBox: false,
      editUserFormBox: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '该项不能为空', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
        ]
      },
      editUserForm: {},
      editUserRules: {
        username: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '该项不能为空', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async getUsersData() {
      var {data: dt} = await this.$http.get('/users', {params: this.usersDataParams})
      // console.log(dt)
      this.usersData = dt.data.users
      this.totalPage = dt.data.total
    },
    handleSizeChange(num) {
      this.usersDataParams.pagesize = num
      this.getUsersData()
    },
    handleCurrentChange(size) {
      this.usersDataParams.pagenum = size
      this.getUsersData()
    },
    submitAddUserForm() {
      this.$refs.addUserRef.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.post('users', this.addUserForm)
          if (dt.meta.status !== 201) {
            this.$refs.addUserRef.resetFields()
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addUserFormBox = false
          this.getUsersData()
        } else {
          return false
        }
      })
    },
    delUser(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: dt} = await this.$http.delete('users/' + userId)
        console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.getUsersData()
        this.$message.success(dt.meta.msg)
      })
    },
    async editUser(userId) {
      this.editUserFormBox = true
      const {data: dt} = await this.$http.get('users/' + userId)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.editUserForm = dt.data
    },
    submitEditUserForm(userId) {
      this.$refs.editUserRef.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.put('users/' + userId, this.editUserForm)
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editUserFormBox = false
          this.getUsersData()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
