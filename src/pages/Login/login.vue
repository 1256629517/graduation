<template>
  <el-container style="height: calc(100vh);">
    <el-header></el-header>
    <el-main style="height: 600px;overflow: hidden;">
      <el-container>
        <el-header class="login-header">欢迎登录</el-header>
        <el-main style="margin-top: 2%;">
          <el-input class="login-input" style="margin-top: 50px;" @keyup.native="userKeyUp" placeholder="请输入用户名" v-model="userName" clearable></el-input>
          <el-input class="login-input" style="margin-top: 30px;" placeholder="请输入密码" v-model="password" show-password clearable></el-input>
        </el-main>
        <el-footer>
          <el-button class="login-button" type="primary" @click="goLogin()"><i v-show="loadingShow" class="el-icon-loading"></i>登录</el-button>
          <div class="login-about">
            <span style="cursor:pointer;" @click="goRegister()">注册账号</span>
            <span style="cursor:pointer;margin-left: auto;" @click="forgetPassword()">忘记密码</span>
          </div>
        </el-footer>
      </el-container>
    </el-main>
    <el-footer class="login-footer">登录代表同意<span style="color:#409EFF;cursor: pointer;" @click="agreementVisible = true">吃了没用户协议</span>和<span style="color:#409EFF;cursor: pointer;" @click="privacyVisible = true">隐私政策</span>，并授权使用您的吃了没账号信息（如昵称、头像、收货地址）以便您统一管理</el-footer>

    <!--验证信息-->
    <el-dialog @close="closeDialog" title="请完成安全验证" :visible.sync="dialogVisible" width="380px" :center="true">
      <slide-verify
        v-loading="loading"
        :l="42"
        :r="10"
        :w="310"
        :h="155"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        :slider-text="text"
        style="margin:auto"
        ref="slideblock">
      </slide-verify>
    </el-dialog>

    <!--弹窗-->
    <el-dialog :title="agreementVisible?'吃了没用户协议':'吃了没隐私政策'" :visible.sync="showVisible" width="380px" :center="true">
      <article v-show="agreementVisible">
        欢迎您注册吃了没账号并使用吃了没的服务！

        本《吃了没平台用户服务协议》（以下简称“本服务协议”）是您与吃了没之间就注册吃了没用户账号及使用吃了没的各项服务等相关事宜所订立的协议。为使用吃了没的服务，您应当仔细阅读并遵守本服务协议下的全部内容，特别是涉及免除或者责任限制的条款，该类条款可能以黑体加粗或加下划线的形式提示您重点注意。除非您已阅读并接受本服务协议所有条款，否则您将不能注册吃了没账号或使用吃了没的服务，如您不同意本服务条款的任意内容，请勿注册或使用吃了没的服务，并应立即停止注册程序。如您对本服务协议的内容（特别是涉及免除或者责任限制的条款）有任何疑义，可随时按照本服务协议中列明的联系方式与我们联系，我们将根据您的要求为您进一步解释和说明相关内容。如您勾选“我同意《吃了没平台用户服务协议》”并通过注册程序或其他任何方式使用或接受吃了没的任何服务，即视为您已阅读并同意本服务协议，自愿接受本服务协议的所有内容的约束。请您在决定注册或使用服务前再次确认您已知悉并完全理解本服务协议的所有内容。

        如果您未满18周岁，请务必在家长和其他法定监护人的陪同下阅读本服务协议，并在进行注册、下单、支付等任何行为或使用吃了没的其他任何服务前，应事先征得您的家长和其他法定监护人的同意。

        本服务协议所述“服务”既包括您使用吃了没用户账号接受吃了没平台相关商家、个人所提供的服务，亦包括在某些特定的业务类别下您使用吃了没用户账号向其他商家、个人或其他主体提供服务的情形。无论“服务”属于上述何种情形，本《吃了没平台用户服务协议》都将予以适用。
      </article>
      <div v-show="privacyVisible">吃了没（以下或称“我们”）非常注重保护用户（“您”）的个人信息及隐私，我们深知个人信息对您的重要性，并将按照法律法规要求和业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。我们希望通过本隐私政策向您清晰地介绍在使用我们的产品/服务时，我们如何处理您的个人信息，以及我们为您提供的访问、更正、删除和保护这些信息的方式。</div>
    </el-dialog>
  </el-container>
</template>

<script>
  import axios from 'axios'
  import store from '../../vuex'
  import mutations from '../../vuex/mutations'

  export default {
    name: "login",
    data() {
      return {
        userName: '',
        password: '',
        text: '向右拖动滑块填充拼图',
        dialogVisible: false,
        loading: false,
        loadingShow: false,
        agreementVisible: false,
        privacyVisible: false,
      }
    },
    computed: {
      showVisible: {
        get() {
          return this.agreementVisible || this.privacyVisible;
        },
        set() {
          this.agreementVisible = false;
          this.privacyVisible = false;
        }
      }
    },
    mounted() {
    },
    methods: {
      // 用户名不能有空格
      userKeyUp() {
        this.userName = this.userName.replace(/[ ]/g,"");
      },
      goLogin() {
        if (this.userName == null || this.userName == "") {
          this.$message({
            message: '请输入用户名',
            type: 'error'
          })
          return;
        }
        if (this.password == null || this.password == "") {
          this.$message({
            message: '请输入密码',
            type: 'error'
          })
          return;
        }
        else {
          this.dialogVisible = true
          this.loadingShow = true;
        }
      },
      // 成功
      onSuccess() {
        this.$refs.slideblock.reset();
        this.$message({
          message: '验证成功！',
          type: 'success'
        });
        let flag = true
        axios.get('/api/account/getAccount').then((res) => {
          // 响应成功回调
          console.log(res)
          for (let i = 0; i < res.data.length; i++) {
            if (this.userName == res.data[i].userName) {
              flag = false
              if (this.password != res.data[i].password) {
                this.$message.error("密码错误！请重新输入密码");
              } else {
                mutations.updateName(store.state,this.userName)
                setTimeout(() => {
                  this.$router.push({
                    path: '/homePage'
                  })
                }, 1000);
              }
            }
          }
          if (flag) {
            this.$message.error("用户名不存在");
          }
        }).catch(err => console.log(err));
        this.loadingShow = false;
        this.dialogVisible = false;
      },
      // 失败
      onFail() {
        this.$message.error("验证未通过！");
        this.$refs.slideblock.reset();
      },
      // 刷新
      onRefresh() {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        });
        this.$refs.slideblock.reset();
      },
      closeDialog() {
        this.loadingShow = false
      },
      goRegister() {
        this.$router.push({
          path: '/register'
        })
      },
      forgetPassword() {
        this.$router.push({
          path: '/findPassword'
        })
      },
    }
  }
</script>

<style scoped>
  .login-header{
    width: 100%;
    height: 70px !important;
    font-size: 90px;
    color: #409EFF;
    text-align: center;
    font-weight: bold;
    letter-spacing: 8px;
  }
  .login-input{
    width: 50%;
    margin-left: 25%;
  }
  >>>.login-input .el-input__inner{
    height: 50px !important;
    font-size: 25px;
  }
  .login-about{
    width: 50%;
    margin-left: 25%;
    color: #888;
    margin-top: 20px;
    display: flex;
  }
  .login-button{
    width: 50%;
    background:linear-gradient(90deg,rgba(111,178,255,1),rgba(9,95,255,1));
    box-shadow:0px 7px 27px 0px rgba(50,129,255,0.51);
    border-radius:8px;
    margin-left: 25%;
    margin-top: 30px;
    height: 50px;
    font-size: 25px;
    letter-spacing: 15px;
  }
  .login-footer{
    height: 40px;
    position: relative;
    bottom: 0;
    text-align: center;
  }
  >>>.el-dialog__header {
    background-color: #409EFF;
  }
  >>>.el-dialog__title {
    color: #fff;
    font-size: 25px;
    letter-spacing: 3px;
    font-weight: bold;
  }
  >>>.el-dialog__close {
    color: #fff;
  }
</style>
