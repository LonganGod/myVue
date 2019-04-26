<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="usersData" border stripe class="data-table">
        <el-table-column type="index" label="序号" width="90"></el-table-column>
        <el-table-column prop="username" label="用户名" width="320"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="320"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="320"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="90">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
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
      totalPage: 0
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
    }
  }
}
</script>

<style scoped>
</style>
