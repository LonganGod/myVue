<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--消息提示-->
      <el-alert title="添加商品" type="info" center show-icon/>
      <!--步骤条-->
      <el-steps :active="active - 1" align-center>
        <el-step title="基本信息"/>
        <el-step title="商品参数"/>
        <el-step title="商品属性"/>
        <el-step title="商品图片"/>
        <el-step title="商品内容"/>
        <el-step title="完成"/>
      </el-steps>
      <!--tab切换表单-->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-width="100px">
        <el-tabs tab-position="left" v-model="active" @tab-click="getGoodsData" :before-leave="checkForm">
          <!--基本信息-->
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                expand-trigger="hover"
                :options="categoriesData"
                v-model="selectedCategories"
                :props="categoriesProps"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!--商品参数-->
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item1.attr_name" v-for="item1 in manyParams" :key="item1.attr_id" label-width="80px">
              <el-checkbox-group v-model="item1.checkedManyParams">
                <el-checkbox :label="v" border v-for="(v, k) in item1.attr_vals" :key="k"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!--商品属性-->
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id" label-width="150px">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!--商品图片-->
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <!--商品内容-->
          <el-tab-pane label="商品内容" name="5">
            <!--富文本编译器-->
            <quill-editor
              v-model="addGoodsForm.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
            <!--按钮-->
            <el-button type="primary" style="margin-top: 20px;" @click="submitAddGoodsForm">添加新商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
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
      // 步骤条和tab切换索引
      active: '1',
      // 添加新商品表单
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      // 添加新商品表单验证规则
      addGoodsRules: {
        goods_name: [{required: true, message: '该项不能为空', trigger: 'blur'}],
        goods_price: [{required: true, message: '该项不能为空', trigger: 'blur'}],
        goods_weight: [{required: true, message: '该项不能为空', trigger: 'blur'}],
        goods_number: [{required: true, message: '该项不能为空', trigger: 'blur'}]
      },
      // 级联下拉列表
      categoriesData: [],
      selectedCategories: [],
      categoriesProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品静态参数数组
      manyParams: [],
      // 商品动态属性数组
      onlyParams: [],
      // 上传图片文件数组
      fileList: [],
      // 上传图片请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 商品介绍
      content: '',
      editorOption: {}
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
    async getGoodsData() {
      if (this.active === '2') {
        const id = this.selectedCategories[2]
        const {data: dt} = await this.$http.get(`categories/${id}/attributes`, {params: {sel: 'many'}})
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        dt.data.forEach(i => {
          i.attr_vals = i.attr_vals.split(',')
          i.checkedManyParams = i.attr_vals
        })
        this.manyParams = dt.data
      }
      if (this.active === '3') {
        const id = this.selectedCategories[2]
        const {data: dt} = await this.$http.get(`categories/${id}/attributes`, {params: {sel: 'only'}})
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.onlyParams = dt.data
      }
    },
    handleSuccess(file) {
      const path = file.response.data.tmp_path
      this.addGoodsForm.pics.push({pic: path})
    },
    handleRemove(file) {
      const path = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(item => {
        return item.pic === path
      })
      this.addGoodsForm.pics.splice(index, 1)
    },
    checkForm() {
      let ischange = false
      this.$refs.addGoodsForm.validate(valid => {
        if (valid) {
          ischange = true
        } else {
          this.$message.error('请按要求填写信息')
          ischange = false
        }
      })
      return ischange
    },
    async submitAddGoodsForm() {
      this.addGoodsForm.goods_cat = this.selectedCategories.join(',')
      this.manyParams.forEach(v => {
        if (v.checkedManyParams.length > 0) {
          let obj = {
            attr_id: v.attr_id,
            attr_value: v.checkedManyParams.join(',')
          }
          this.addGoodsForm.attrs.push(obj)
        }
      })
      this.onlyParams.forEach(v => {
        if (v.attr_vals.length > 0) {
          let obj = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals
          }
          this.addGoodsForm.attrs.push(obj)
        }
      })
      console.log(this.onlyParams)
      const {data: dt} = await this.$http.post('goods', this.addGoodsForm)
      if (dt.meta.status !== 201) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.$router.push('/goods')
    }
  }
}
</script>

<style lang="less" scoped>
  .el-checkbox {
    vertical-align: middle;
    margin-right: 5px;
  }
</style>
