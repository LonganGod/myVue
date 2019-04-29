<template>
  <div>
    <!--面包屑-->
    <breadcrumb nm="角色" tp="列表"></breadcrumb>
    <el-card class="box-card">
      <!--添加新角色-->
      <div style="margin-bottom: 20px">
        <el-button type="primary" @click="addRoles()">添加角色</el-button>
      </div>
      <!--列表展示-->
      <el-table :data="rolesData" border stripe>
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row v-for="(item1, k) in info.row.son" :key="item1.id"
                    :style="[k == 0 ? {borderTop: '1px solid rgba(235, 238, 245)'} : {borderTop: '0px'}, {borderBottom: '1px solid rgba(235, 238, 245)'}]">
              <el-col :span="5">
                <el-tag closable @close="delRights(info.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, k2) in item1.children" :key="item2.id"
                        :style="k2 == 0 ? {borderTop: '0px'} : {borderTop: '1px solid rgba(235, 238, 245)'}">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="delRights(info.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id"
                            @close="delRights(info.row, item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="600"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="600"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(info.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRoles(info.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignRights(info.row)">权限分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--添加新角色-->
      <el-dialog title="添加新角色" :visible.sync="addRolesBox">
        <el-form ref="addRolesForm" :rules="addRolesRules" :model="addRolesForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRolesBox = false">取 消</el-button>
          <el-button type="primary" @click="submitAddRolesForm()">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑角色-->
      <el-dialog title="编辑角色" :visible.sync="editRolesBox">
        <el-form ref="editRolesForm" :rules="editRolesRules" :model="editRolesForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRolesBox = false">取 消</el-button>
          <el-button type="primary" @click="submitEditRolesForm(editRolesForm.roleId)">确 定</el-button>
        </div>
      </el-dialog>
      <!--分配角色-->
      <el-dialog title="分配权限" :visible.sync="assignRightsBox">
        <el-tree
          :data="rightsData"
          :props="rightsTreeProps"
          :default-checked-keys="defaultRights"
          node-key="id"
          default-expand-all
          show-checkbox
          ref="treeRef"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignRightsBox = false">取 消</el-button>
          <el-button type="primary" @click="setRights()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesData()
  },
  data() {
    return {
      rolesData: [],
      addRolesBox: false,
      editRolesBox: false,
      assignRightsBox: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
      },
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesRules: {
        roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
      },
      rightsData: [],
      rightsTreeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultRights: []
    }
  },
  methods: {
    async getRolesData() {
      var {data: dt} = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(item => {
        item.son = item.children
        delete item.children
      })
      this.rolesData = dt.data
    },
    addRoles() {
      this.addRolesBox = true
    },
    submitAddRolesForm() {
      this.$refs.addRolesForm.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.post('roles', this.addRolesForm)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addRolesBox = false
          this.getRolesData()
        }
      })
    },
    delRights(role, rightsId) {
      this.$confirm('此操作将永久删除该条权限，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: dt} = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        role.son = dt.data
      })
    },
    async editRoles(roleId) {
      this.editRolesBox = true
      const {data: dt} = await this.$http.get('roles/' + roleId)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.editRolesForm = dt.data
    },
    submitEditRolesForm(roleId) {
      this.$refs.editRolesForm.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.put('roles/' + roleId, this.editRolesForm)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editRolesBox = false
          this.getRolesData()
        }
      })
    },
    delRoles(roleId) {
      this.$confirm('此操作将永久删除该名角色，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: dt} = await this.$http.delete('roles/' + roleId)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.getRolesData()
      })
    },
    async assignRights(role) {
      const {data: dt} = await this.$http.get('rights/tree')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsData = dt.data
      var defaultRights = []
      this.pushDefaultRights(role.son, defaultRights)
      this.defaultRights = defaultRights
      this.editRolesForm = role
      this.assignRightsBox = true
    },
    pushDefaultRights(rights, arr) {
      rights.forEach(item => {
        if (!item.children) {
          return arr.push(item.id)
        }
        this.pushDefaultRights(item.children, arr)
      })
    },
    async setRights() {
      var ck1 = this.$refs.treeRef.getCheckedKeys()
      var ck2 = this.$refs.treeRef.getHalfCheckedKeys()
      var ck = ck1.concat(ck2).join(',')
      const {data: dt} = await this.$http.post('roles/' + this.editRolesForm.id + '/rights', {rids: ck})
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.getRolesData()
      this.assignRightsBox = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-row {
    display: flex;
    align-items: center;

    .el-tag {
      margin: 10px 5px;
      user-select: none;
    }
  }
</style>
