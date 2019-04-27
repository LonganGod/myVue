<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{nm}}管理</el-breadcrumb-item>
    <el-breadcrumb-item>{{nm}}{{tp}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['nm', 'tp']
}
</script>

<style scoped>

</style>
