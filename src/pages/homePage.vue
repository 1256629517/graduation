<template>
  <el-container class="container">
    <router-view></router-view>
    <el-footer>
      <ul class="footer">
        <li @click="goHome()" :class="{active:isActive1}">
          <i class="iconfont icondaohangshouye"></i>
          <div>首页</div>
        </li>
        <li @click="goOrder()" :class="isActive2">
          <i class="iconfont icondingdan1"></i>
          <div>订单</div>
        </li>
        <li @click="goUser()" :class="{active:isActive3}">
          <i class="iconfont iconyonghu"></i>
          <div>我的</div>
        </li>
      </ul>
    </el-footer>
  </el-container>
</template>

<script>

  export default {
    name: "homePage",
    data() {
      return {
        isActive1: '',
        isActive2: '',
        isActive3: '',
      }
    },
    created() {
      this.goHome()
    },
    watch: {
      '$route.path': 'goPath'
    },
    methods: {
      goPath() {
        if (this.$route.path === '/firstPage') {
          this.isActive1 = true
          this.isActive2 = false
          this.isActive3 = false
        } else if (this.$route.path === '/order') {
          this.isActive1 = false
          this.isActive2 = true
          this.isActive3 = false
        } else if (this.$route.path === '/user') {
          this.isActive1 = false
          this.isActive2 = false
          this.isActive3 = true
        }
      },
      goHome() {
        this.$router.push({
          path: '/firstPage'
        })
      },
      goOrder() {
        this.$router.push({
          path: '/order'
        })
      },
      goUser() {
        this.$router.push({
          path: '/user'
        })
      }
    }
  }
</script>

<style scoped>
  .el-footer {
    position: fixed;
    bottom: 0;
    border-top: 1px solid #DCDFE6;
    width: 100%;
    background-color: #fff;
    z-index: 20;
  }

  .footer {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0;
    padding: 0;
  }

  .footer li {
    cursor: pointer;
  }

  .footer li:hover{
    color: #409EFF;
  }

  .footer .active{
    color: #409EFF;
  }

  .footer .iconfont {
    font-size: 28px;
  }
</style>
