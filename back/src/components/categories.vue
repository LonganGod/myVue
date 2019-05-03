<template>
  <div>
    <!--面包屑-->
    <breadcrumb nm="商品" tp="分类"></breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--分类按钮-->
      <el-button type="primary" @click="showAddCategoriesBox">添加分类</el-button>
      <!--表格-->
      <el-table :data="categoriesData" border row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称" width="400"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="400">
          <template slot-scope="info">
            <i
              :class="info.row.deleted ? 'el-icon-error' : 'el-icon-success'"
              :style="info.row.deleted ? {color: 'red'} : {color: 'rgb(68, 178, 170)'}"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level==0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="操作" width="400">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCategoriesBox(info.row)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCategories(info.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="getCategoriesParams.pagesize"
        :current-page="getCategoriesParams.pagenum"
      >
      </el-pagination>
      <!--添加分类-->
      <el-dialog
        title="添加分类"
        :visible.sync="addCategoriesBox"
      >
        <div>
          <el-form ref="addCategoriesForm" :model="addCategoriesForm" :rules="addCategoriesRules" label-width="80px">
            <el-form-item label="活动名称" prop="cat_name">
              <el-input v-model="addCategoriesForm.cat_name" placeholder="请输入活动名称"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-cascader
                expand-trigger="hover"
                :options="categoriesList"
                v-model="selectedCategories"
                :props="categoriesListProps"
                clearable
                change-on-select
                style="width: 100%"
              >
              </el-cascader>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCategoriesBox = false">取 消</el-button>
          <el-button type="primary" @click="submitAddCategoriesForm">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑分类-->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCategoriesBox"
      >
        <div>
          <el-form ref="editCategoriesForm" :model="editCategoriesForm" :rules="editCategoriesRules" label-width="80px">
            <el-form-item label="活动名称" prop="cat_name">
              <el-input v-model="editCategoriesForm.cat_name" placeholder="请输入活动新名称"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCategoriesBox = false">取 消</el-button>
          <el-button type="primary" @click="submitEditCategoriesForm">确 定</el-button>
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
      getCategoriesParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addCategoriesBox: false,
      addCategoriesForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCategoriesRules: {
        cat_name: [{required: true, message: '请输入活动名称', trigger: 'blur'}]
      },
      categoriesList: [],
      selectedCategories: [],
      categoriesListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editCategoriesBox: false,
      editCategoriesForm: {
        cat_id: 0,
        cat_name: ''
      },
      editCategoriesRules: {
        cat_name: [{required: true, message: '请输入活动名称', trigger: 'blur'}]
      }
    }
  },
  methods: {
    async getCategoriesData() {
      const {data: dt} = await this.$http.get('categories', {params: this.getCategoriesParams})
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.categoriesData = dt.data.result
      this.total = dt.data.total
    },
    handleCurrentChange(num) {
      this.getCategoriesParams.pagenum = num
      this.getCategoriesData()
    },
    showAddCategoriesBox() {
      this.getCategoriesList()
      this.addCategoriesBox = true
    },
    async getCategoriesList() {
      const {data: dt} = await this.$http.get('categories', {params: {type: 2}})
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.categoriesList = dt.data
    },
    submitAddCategoriesForm() {
      this.$refs.addCategoriesForm.validate(async(valid) => {
        if (valid) {
          const arr = this.selectedCategories
          if (arr.length !== 0) {
            this.addCategoriesForm.cat_pid = arr[arr.length - 1]
            this.addCategoriesForm.cat_level = arr.length
          }
          const {data: dt} = await this.$http.post('categories', this.addCategoriesForm)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addCategoriesBox = false
          this.getCategoriesData()
        }
      })
    },
    showEditCategoriesBox(catObj) {
      this.editCategoriesForm.cat_id = catObj.cat_id
      this.editCategoriesBox = true
    },
    submitEditCategoriesForm() {
      this.$refs.editCategoriesForm.validate(async(valid) => {
        if (valid) {
          const {data: dt} = await this.$http.put(`categories/${this.editCategoriesForm.cat_id}`, this.editCategoriesForm)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editCategoriesBox = false
          this.getCategoriesData()
        }
      })
    },
    delCategories(catObj) {
      this.$confirm('此操作将永久删除该商品分类，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: dt} = await this.$http.delete('categories/' + catObj.cat_id)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.getCategoriesData()
      })
    }
  }
}
</script>

<style scoped>

</style>
