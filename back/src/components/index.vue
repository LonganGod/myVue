<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/logo-light.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width=" isOpen ? '65px' : '200px' ">
        <div class="collapse-box" @click="isOpen = !isOpen">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#D10024"
          :unique-opened="true"
          :collapse="isOpen"
          :collapse-transition="false"
          :style=" isOpen ? {width: '65px'} : {width: '200px'} "
          :router="true">

          <el-submenu v-for="(item, index) in listData" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="'iconfont icon-' + listIcon[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getListData()
  },
  data() {
    return {
      isOpen: false,
      listData: [],
      listIcon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    async getListData() {
      var {data: dt} = await this.$http.get('/menus')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.listData = dt.data
    },
    logout() {
      this.$confirm('您确定要退出吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;

    .el-header {
      background-color: #373d41;
      display: flex;
      align-items: center;
      place-content: space-between;

      .logo-box {
        display: flex;
        align-items: center;

        img {
          height: 50px;
          margin-right: 20px;
          user-select: none;
        }

        span {
          font-size: 22px;
          color: #fff;
          user-select: none;
        }
      }
    }

    .el-aside {
      background-color: #333744;
      user-select: none;

      .el-menu {
        border: 0;
      }

      .collapse-box {
        height: 25px;
        line-height: 25px;
        text-align: center;
        background-color: #4a5064;
        color: #fff;
        font-size: 12px;
        letter-spacing: .2em;
        cursor: pointer;
      }

      i.iconfont {
        margin-right: 10px;
      }

      span {
        font-size: 13px;
      }
    }

    .el-main {
      background-color: #eaedf1;
    }
  }
</style>
