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
          <el-header class="findHeader">找回密码</el-header>
          <el-main>
            <el-input class="find-input" style="margin-top: 50px;" @keyup.native="userKeyUp" placeholder="请输入用户名" v-model="userName" clearable></el-input>
            <el-input class="find-input" style="margin-top: 30px;" placeholder="请输入新密码" v-model="password" show-password clearable></el-input>
            <el-input class="find-input" style="margin-top: 30px;" placeholder="请确认新密码" v-model="repassword" show-password clearable></el-input>
            <el-select class="find-select" style="width: 50%;margin-left: 25%;margin-top: 30px;" v-model="selectValue" clearable placeholder="请选择密保问题">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input class="find-input" style="margin-top: 30px;" placeholder="请输入你的答案" v-model="answer" clearable></el-input>
          </el-main>
          <el-footer>
            <el-button class="find-button" type="primary" @click="goFind()">确认</el-button>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "findPassword",
    data() {
      return {
        userName: '',
        password: '',
        repassword: '',
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
      }
    },
    methods: {
      // 用户名不能有空格
      userKeyUp(e) {
        e.target.value = e.target.value.replace(/[ ]/g,"");
      },
      goLogin() {
        this.$router.push({
          path: '/login'
        })
      },
      goFind() {
        if (this.userName == null || this.userName == "") {
          this.$message.error("用户名不能为空");
          return;
        } else if (this.password == null || this.password == "") {
          this.$message.error("新密码不能为空");
          return;
        } else if (this.repassword == null || this.repassword == "") {
          this.$message.error("确认密码不能为空");
          return;
        } else if (this.password != this.repassword) {
          this.$message.error("两次输入密码不一致");
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
          };
          let flag = true
          axios.get('/api/account/getAccount').then((res) => {
            // 响应成功回调
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              if (this.userName == res.data[i].userName) {
                flag = false
                if (this.selectValue != res.data[i].selectValue || this.answer != res.data[i].answer) {
                  this.$message.error("密保问题或答案不一致");
                } else {
                  axios.put('/api/account/changeAccountPwd', params).then((res) => {
                    if (res.status == 200) {
                      console.log(res);
                      setTimeout(() => {
                        this.$message({
                          type: "success",
                          message: "修改成功！"
                        });
                      }, 1000);
                    }
                    setTimeout(() => {
                      this.goLogin()
                    }, 1000);
                  }).catch(err => console.log(err));
                }
              }
            }
            if (flag) {
              this.$message.error("用户名不存在");
            }
          }).catch(err => console.log(err));
        }
      },
    }
  }
</script>

<style scoped>
  .findHeader {
    width: 100%;
    height: 70px !important;
    font-size: 90px;
    color: #409EFF;
    text-align: center;
    font-weight: bold;
    letter-spacing: 8px;
  }
  .find-input{
    width: 50%;
    margin-left: 25%;
  }
  >>>.find-input .el-input__inner{
    height: 50px !important;
    font-size: 25px;
  }
  >>>.find-select .el-input--suffix .el-input__inner{
    height: 50px !important;
    font-size: 25px;
  }
  .find-button{
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
</style>
