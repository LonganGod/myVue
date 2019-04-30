<template>
  <div>
    <!--面包屑-->
    <breadcrumb nm="参数" tp="列表"></breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--警告-->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!--级联下拉列表-->
      <el-row style="margin: 20px 0;">
        <el-col>选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="categoriesData"
            v-model="selectedCategoriesData"
            :props="categoriesProps"
            clearable
            @change="selectedChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!--tabs切换项-->
      <el-tabs v-model="activeTabName" @tab-click="selectedChange">
        <!--动态参数-->
        <el-tab-pane label="动态参数" name="many">
          <!--按钮-->
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedCategoriesData.length === 0 ? true : false"
            @click="showAddAttr('many')"
          >
            添加参数
          </el-button>
          <!--表格-->
          <el-table :data="attributesData" border>
            <el-table-column type="expand">
              <template slot-scope="info">
                <el-tag
                  :key="k"
                  v-for="(v, k) in info.row.attr_vals_arr"
                  closable
                  disable-transitions
                  style="margin-top: 5px; margin-right: 5px;"
                  @close="delAttrTag(info.row, k)"
                >
                  {{v}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="addAttrTag(info.row)"
                  @keyup.enter.native="addAttrTag(info.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="inputVisible = true">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="info">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttr(info.row)"
                >
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttr(info.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性-->
        <el-tab-pane label="静态属性" name="only">
          <!--按钮-->
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedCategoriesData.length === 0 ? true : false"
            @click="showAddAttr('only')"
          >
            添加属性
          </el-button>
          <!--表格-->
          <el-table :data="attributesData" border>
            <el-table-column type="expand">
              <template slot-scope="info">
                <el-tag
                  :key="k"
                  v-for="(v, k) in info.row.attr_vals_arr"
                  closable
                  disable-transitions
                  style="margin-top: 5px; margin-right: 5px;"
                  @close="delAttrTag(info.row, k)"
                >
                  {{v}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="addAttrTag(info.row)"
                  @keyup.enter.native="addAttrTag(info.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="inputVisible = true">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="info">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditAttr(info.row)"
                >
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttr(info.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--添加动态参数或静态属性-->
      <el-dialog
        title="添加属性或参数"
        :visible.sync="addAttrBox"
        width="30%"
        @keyup.enter.native="submitAddAttr"
      >
        <div>
          <el-form :model="addAttrForm" :rules="addAttrRules" ref="addAttrForm" label-width="130px">
            <el-form-item prop="attr_name" label="属性或参数名称">
              <el-input v-model="addAttrForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addAttrBox = false">取 消</el-button>
          <el-button type="primary" @click="submitAddAttr">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改动态参数或静态属性-->
      <el-dialog
        title="修改属性或参数"
        :visible.sync="editAttrBox"
        width="30%"
        @keyup.enter.native="submitEditAttr"
      >
        <div>
          <el-form :model="editAttrForm" :rules="editAttrRules" ref="editAttrForm" label-width="130px">
            <el-form-item prop="attr_name" label="属性或参数名称">
              <el-input v-model="editAttrForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editAttrBox = false">取 消</el-button>
          <el-button type="primary" @click="submitEditAttr">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategoriesData()
  },
  data() {
    return {
      categoriesData: [],
      selectedCategoriesData: [],
      categoriesProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeTabName: 'many',
      attributesData: [],
      inputVisible: false,
      inputValue: '',
      addAttrBox: false,
      addAttrForm: {
        attr_name: '',
        attr_sel: ''
      },
      addAttrRules: {
        attr_name: [{required: true, message: '请选择属性或参数名称', trigger: 'blur'}]
      },
      editAttrBox: false,
      editAttrForm: {},
      editAttrRules: {
        attr_name: [{required: true, message: '请选择属性或参数名称', trigger: 'blur'}]
      },
    }
  },
  methods: {
    async getCategoriesData() {
      const {data: dt} = await this.$http.get('categories')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.categoriesData = dt.data
    },
    async getAttributesList(attributesType) {
      const arr = this.selectedCategoriesData
      const {data: dt} = await this.$http.get(`categories/${arr[arr.length - 1]}/attributes`, {params: {sel: attributesType}})
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(item => {
        if (item.attr_vals !== '') {
          item.attr_vals_arr = item.attr_vals.split(',')
        }
      })
      this.attributesData = dt.data
    },
    selectedChange() {
      if (this.selectedCategoriesData.length === 0) {
        return this.attributesData = []
      }
      this.getAttributesList(this.activeTabName)
    },
    addAttrTag(attr) {
      if (!attr.attr_vals_arr) {
        attr.attr_vals_arr = []
      }
      if (this.inputValue !== '') {
        attr.attr_vals_arr.push(this.inputValue)
        attr.attr_vals = attr.attr_vals_arr.join(',')
        this.$http.put(`categories/${attr.cat_id}/attributes/${attr.attr_id}`, attr)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    delAttrTag(attr, k) {
      this.$confirm('确定要永久删除这条属性？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        attr.attr_vals_arr.splice(k, 1)
        attr.attr_vals = attr.attr_vals_arr.join(',')
        this.$http.put(`categories/${attr.cat_id}/attributes/${attr.attr_id}`, attr)
      })
    },
    showAddAttr(type) {
      this.addAttrForm.attr_sel = type
      this.addAttrBox = true
    },
    submitAddAttr() {
      this.$refs.addAttrForm.validate(async(valid) => {
        if (valid) {
          const arr = this.selectedCategoriesData
          const id = arr[arr.length - 1]
          const {data: dt} = await this.$http.post(`categories/${id}/attributes`, this.addAttrForm)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.$refs.addAttrForm.resetFields()
          this.addAttrBox = false
          this.getAttributesList(this.addAttrForm.attr_sel)
        }
      })
    },
    showEditAttr(attr) {
      this.editAttrForm = attr
      this.editAttrBox = true
    },
    submitEditAttr() {
      this.$refs.editAttrForm.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.put(`categories/${this.editAttrForm.cat_id}/attributes/${this.editAttrForm.attr_id}`, this.editAttrForm)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editAttrBox = false
          this.getAttributesList(this.editAttrForm.attr_sel)
        }
      })
    },
    delAttr(attr) {
      this.$confirm('确定要永久删除这条属性？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: dt} = await this.$http.delete(`categories/${attr.cat_id}/attributes/${attr.attr_id}`)
        if (dt.meta.status !== 200) {
          console.log(1)
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.getAttributesList(attr.attr_sel)
      })
    }
  }
}
</script>

<style scoped>
  .input-new-tag {
    width: 90px;
    vertical-align: middle;
  }
</style>
