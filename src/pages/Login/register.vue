<template>
  <div>
    <el-container>
      <el-header style="text-align: right;line-height: 40px;color:#409EFF;">
        <span style="cursor:pointer;" @click="goLogin()">已有帐号，去登陆
          <i class="el-icon-arrow-right"></i>
        </span>
      </el-header>
      <el-main style="height: 800px;overflow: hidden;margin-top: 2%;">
        <el-container>
          <el-header class="registerHeader">注册账号</el-header>
          <el-main>
            <el-input class="register-input" style="margin-top: 50px;" @keyup.native="userKeyUp" placeholder="请输入用户名" v-model="userName" clearable></el-input>
            <el-input class="register-input" style="margin-top: 30px;" placeholder="请输入密码" v-model="password" show-password clearable></el-input>
            <el-select class="register-select" style="width: 50%;margin-left: 25%;margin-top: 30px;" v-model="selectValue" clearable placeholder="请选择密保问题">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input class="register-input" style="margin-top: 30px;" placeholder="请输入你的答案" v-model="answer" clearable></el-input>
          </el-main>
          <el-footer>
            <el-button class="register-button" type="primary" @click="goRegister()">注册</el-button>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
    <el-dialog title="是否返回登录页面" top="20%" :visible.sync="dialogVisible" width="380px" :center="true">
      <div style="display: flex">
        <el-button type="primary" @click="dialogVisible = false">留在本页面</el-button>
        <el-button style="margin-left: auto" type="primary" @click="goLogin()">返回登陆页</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "register",
    data() {
      return {
        userName: '',
        password: '',
        options: [
          {
            value: 1,
            label: '你的名字'
          },
          {
            value: 2,
            label: '你母亲的名字'
          },
          {
            value: 3,
            label: '你父亲的名字'
          },
          {
            value: 4,
            label: '你的学号'
          },
          {
            value: 5,
            label: '你的年龄'
          }
        ],
        selectValue: '',
        answer: '',
        dialogVisible: false,
        shops: [],
      }
    },
    created() {
      axios.get('/api/shops/getShops').then((res) => {
        console.log(res);
        this.shops = res.data
      })
    },
    methods: {
      // 用户名不能有空格
      userKeyUp() {
        this.userName = this.userName.replace(/[ ]/g,"");
      },
      goLogin() {
        this.$router.push({
          path: '/login'
        })
      },
      goRegister() {
        if (this.userName == null || this.userName == "") {
          this.$message.error("用户名不能为空");
          return;
        } else if (this.password == null || this.password == "") {
          this.$message.error("密码不能为空");
          return;
        } else if (this.selectValue == null || this.selectValue == "") {
          this.$message.error("请选择密保问题");
          return;
        } else if (this.answer == null || this.answer == "") {
          this.$message.error("请输入你的答案");
          return;
        } else {
          let params = {
            userName: this.userName,
            password: this.password,
            selectValue: this.selectValue,
            answer: this.answer,
            shops: this.shops
          };
          console.log(params);
          let flag = true
          axios.get('/api/account/getAccount').then((res) => {
            // 响应成功回调
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              if (this.userName == res.data[i].userName) {
                this.$message.error("用户名已存在请直接登录");
                flag = false
              }
            }
            console.log(params);
            if (flag) {
              axios.post('/api/account/createAccount', params).then((res) => {
                if (res.status == 200) {
                  console.log(res);
                  setTimeout(() => {
                    this.$message({
                      type: "success",
                      message: "创建成功！"
                    });
                    this.dialogVisible = true
                    this.userName = ''
                    this.password = ''
                    this.selectValue = ''
                    this.answer = ''
                    this.shops = []
                  }, 1000);
                }
              }).catch(err => console.log(err));
            }
          }).catch(err => console.log(err));
        }
      },
    }
  }
</script>

<style scoped>
  .registerHeader {
    width: 100%;
    height: 70px !important;
    font-size: 90px;
    color: #409EFF;
    text-align: center;
    font-weight: bold;
    letter-spacing: 8px;
  }
  .register-input{
    width: 50%;
    margin-left: 25%;
  }
  >>>.register-input .el-input__inner{
    height: 50px !important;
    font-size: 25px;
  }
  >>>.register-select .el-input--suffix .el-input__inner{
    height: 50px !important;
    font-size: 25px;
  }
  .register-button{
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
