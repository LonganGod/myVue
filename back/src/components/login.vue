<template>
  <div class="Login_bg_box">
    <div class="Login_form_box">
      <div class="admin_icon">
        <img src="../assets/img/default.png" alt="">
      </div>
      <el-form ref="Login_form" :model="LoginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" placeholder="请输入用户名">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="LoginForm.password" placeholder="请输入密码">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-col :push="15">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="reset()">重置</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        LoginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.Login_form.validate(async (valid) => {
          if (valid) {
            var {data: dt} = await this.$http.post('/login', this.LoginForm)
            if (dt.meta.status !== 200) {
              this.$refs.Login_form.resetFields();
              return this.$message({type: 'error', message: dt.meta.msg, duration: 1000})
            }
            window.sessionStorage.setItem('token', dt.data.token)
            this.$router.push('/index')
          }
        });
      },
      reset() {
        this.$refs.Login_form.resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  .Login_bg_box {
    background-color: #2b4b6b;
    height: 100%;

    .Login_form_box {
      width: 450px;
      height: 304px;
      background-color: #fff;
      border-radius: 4px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .admin_icon {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #eee;
        padding: 8px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
          width: 100%;
          border-radius: 50%;
        }
      }

      .el-form {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
      }
    }
  }
</style>
