<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
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
        <el-step title="商品内容"/>
        <el-step title="完成"/>
      </el-steps>
      <!--tab切换表单-->
      <el-form :model="editGoodsForm" :rules="editGoodsRules" ref="editGoodsForm" label-width="100px">
        <el-tabs tab-position="left" v-model="active" @tab-click="getGoodsData" :before-leave="checkForm">
          <!--基本信息-->
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="editGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="editGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="editGoodsForm.goods_number"></el-input>
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
              <el-checkbox-group v-model="item1.attr_value">
                <el-checkbox :label="v" border v-for="(v, k) in item1.attr_vals" :key="k"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!--商品属性-->
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id" label-width="150px">
              <el-input v-model="item.attr_value"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!--商品内容-->
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编译器-->
            <quill-editor
              v-model="editGoodsForm.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
            <!--按钮-->
            <el-button type="primary" style="margin-top: 20px;" @click="submitEditGoodsForm">编辑商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['id'],
  created() {
    this.getCategoriesData()
    this.getGoodsDataById()
  },
  data() {
    return {
      // 步骤条和tab切换索引
      active: '1',
      // 添加新商品表单
      editGoodsForm: {},
      // 添加新商品表单验证规则
      editGoodsRules: {
        goods_name: [{required: true, message: '该项不能为空', trigger: 'blur'}],
        goods_price: [{required: true, message: '该项不能为空'}, {type: 'number', message: '该项必须为数值类型'}],
        goods_weight: [{required: true, message: '该项不能为空'}, {type: 'number', message: '该项必须为数值类型'}],
        goods_number: [{required: true, message: '该项不能为空'}, {type: 'number', message: '该项必须为数值类型'}]
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
      // 商品介绍
      content: '',
      editorOption: {}
    }
  },
  methods: {
    async getGoodsDataById() {
      const {data: dt} = await this.$http.get(`goods/${this.id}`)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      console.log(dt)
      this.editGoodsForm = dt.data
      this.selectedCategories = dt.data.goods_cat.split(',')
      this.selectedCategories.forEach((v, i) => {
        this.selectedCategories[i] = v - 0
      })
    },
    async getCategoriesData() {
      const {data: dt} = await this.$http.get('categories')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.categoriesData = dt.data
    },
    async getGoodsData() {
      if (this.active === '2') {
        this.editGoodsForm.attrs.forEach(v1 => {
          if (v1.attr_sel === 'many') {
            v1.attr_vals = v1.attr_vals.split(',')
            v1.attr_value = v1.attr_value.split(',')
            this.manyParams.push(v1)
          }
        })
      }
      if (this.active === '3') {
        this.editGoodsForm.attrs.forEach(v1 => {
          if (v1.attr_sel === 'only') {
            this.onlyParams.push(v1)
          }
        })
      }
    },
    checkForm() {
      let ischange = false
      this.$refs.editGoodsForm.validate(valid => {
        if (valid) {
          ischange = true
        } else {
          this.$message.error('请按要求填写信息')
          ischange = false
        }
      })
      return ischange
    },
    async submitEditGoodsForm() {
      this.editGoodsForm.goods_cat = this.selectedCategories.join(',')
      this.manyParams.forEach(v => {
        if (v.attr_value.length > 0) {
          let obj = {
            attr_id: v.attr_id,
            attr_value: v.attr_value.join(',')
          }
          this.editGoodsForm.attrs.push(obj)
        }
      })
      const {data: dt} = await this.$http.put(`goods/${this.id}`, this.editGoodsForm)
      if (dt.meta.status !== 200) {
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
