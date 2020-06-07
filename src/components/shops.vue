<template>
  <div>
    <el-container v-for="(item,index) in shopGroups" :key="index" style="cursor:pointer;"
                  @click.native="goDetails(item.name)">
      <el-aside width="200px" style="padding-top: 10px;overflow: hidden">
        <span class="brand">品牌</span>
        <img :src="item.imgUrl" alt="" style="width: 200px;position: relative;top: -20px;height: 90%;">
      </el-aside>
      <el-main class="main-shops" style="">
        <div style="font-weight: bold;">{{item.name}}</div>
        <div style="display: flex">
          <!--<i class="iconfont iconxingji" style="color:#FFD306;font-size: 25px"></i>-->
          <!--<span style="color:#FFD306;margin-right: 20px;">{{item.score}}</span>-->
          <span style="">月售{{item.sell}}</span>
          <span class="main-shops-logo">吃了没专送</span>
        </div>
        <div>
          <span>￥20起送 / 配送费￥{{item.distributionFee}}</span>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import common from '../assets/js/common'

  export default {
    name: "shops",
    data() {
      return {
        shopGroups: [],
      }
    },
    created() {
      this.query()
    },
    methods: {
      // 查询
      query(inputValue, value) {
        this.shopGroups = []
        if (inputValue == "" || inputValue == null) {
          if (value == "" || value == null) {
            axios.get('/api/shops/getShops').then((res) => {
              // 响应成功回调
              console.log(res)
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].imgUrl = common.getImgUrl(res.data[i].imgUrl)
              }
              this.shopGroups = res.data
            })
          } else {
              axios.get('/api/shops/getShops').then((res) => {
                // 响应成功回调
                console.log(res)
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].imgUrl = common.getImgUrl(res.data[i].imgUrl)
                  if (res.data[i].shopType == value) {
                    this.shopGroups.push(res.data[i])
                  }
                }
              })
          }
        } else {
          if (value == "" || value == null) {
            axios.get('/api/shops/getShops').then((res) => {
              // 响应成功回调
              console.log(res)
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].imgUrl = common.getImgUrl(res.data[i].imgUrl)
                if (res.data[i].name.indexOf(inputValue) != -1) {
                  this.shopGroups.push(res.data[i])
                }
              }
            })
          } else {
            console.log("分类");
            axios.get('/api/shops/getShops').then((res) => {
              // 响应成功回调
              console.log(res)
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].imgUrl = common.getImgUrl(res.data[i].imgUrl)
                if (res.data[i].shopType == value) {
                  this.shopGroups.push(res.data[i])
                }
              }
            })
          }
        }
      },
      goDetails(name) {
        this.$router.push({
          path: '/shopDetails',
          query: {
            shopName: name
          }
        })
      }
    }
  }
</script>

<style scoped>
  .brand {
    position: relative;
    z-index: 2;
    padding: 2px;
    border-radius: 3px;
    background-image: linear-gradient(to right, #F9F900, #FFD306);
  }

  .main-shops {
    padding: 10px 0 10px 20px;
    font-size: 25px;
  }

  .main-shops div:not(:first-child) {
    margin-top: 20px;
  }

  .main-shops .main-shops-logo {
    margin-left: auto;
    display: inline-block;
    padding: 6px;
    background-color: #409EFF;
    border-radius: 18px 0 18px 0;
    color: #fff;
    font-size: 15px;
  }
</style>
