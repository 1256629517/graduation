<template>
  <div>
    <el-container style="height: 100vh;background-color: #F5F5F5;">
      <el-header
        style="background-color: #fff;line-height: 40px;;font-size: 30px;font-weight: bold;padding: 10px 20px;">我的订单
      </el-header>
      <el-main style="padding: 10px 20px">
        <div v-show="!orderShow" class="order-not-order" style="">
          <div style="font-size: 30px;margin-bottom: 10px;padding-top: 22%;">还没有订单哦~~~</div>
          <el-button type="primary" @click="goOrder()">去下单</el-button>
        </div>
        <div v-show="orderShow" style="margin-bottom: 60px;">
          <el-container v-for="(item,index) in orderArr" :key="index"
                        style="margin-bottom: 10px;background-color: #fff;border-radius: 10px;cursor:pointer;"
                        @click.native="goOrderDetail(index)">
            <el-header style="padding-top: 14px;height: 60px;">
              <el-container @click.native="goMore(item.shopName)">
                <el-aside width="100px">
                  <img style="width: 100px;" :src="item.imgUrl" alt="">
                </el-aside>
                <el-main style="display: flex;">
                  <div style="font-size: 24px;font-weight: bold">{{item.shopName}}<i class="el-icon-arrow-right"></i></div>
                  <div style="margin-left: auto;color:#888;font-size: 20px;">已完成</div>
                </el-main>
              </el-container>
            </el-header>
            <el-main style="display: flex;padding-bottom: 5px;">
              <span style="width: 90%;display: flex;overflow: hidden">
                <div v-for="temp in item.goodsArr" style="margin: 5px 10px 0 0;">
                  <div>
                    <img style="width: 120px;border-radius: 5px;height: 80px;" :src="temp.imgUrl" alt="">
                  </div>
                  <div
                    style="width: 120px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{temp.name}}</div>
                </div>
              </span>
              <span style="width: 10%;margin-left: auto;text-align: right;font-size: 20px;">
                <div style="margin-top: 20px">￥{{item.total}}</div>
                <div style="font-size: 16px;">共{{item.totalLength}}件</div>
              </span>
            </el-main>
            <el-footer style="height: 50px;">
              <el-button style="float: right" plain @click="goMore(item.shopName)">再来一单</el-button>
            </el-footer>
          </el-container>
        </div>
      </el-main>
    </el-container>

    <!-- 订单详情 -->
    <el-dialog
      center
      title="订单详情"
      :visible.sync="orderDialog"
      width="40%"
      top="6%"
      style="font-weight: bold;">
      <div style="">
        <el-main style="padding: 0;margin-bottom: 60px;">
          <el-container>
            <el-header>
              <div style="margin-top: 10px;font-size: 20px;font-weight: bold;cursor:pointer;" @click="goMore(orderDetail.shopName)">
                {{orderDetail.shopName}}<i class="el-icon-arrow-right"></i>
              </div>
              <el-divider></el-divider>
            </el-header>
            <el-main style="padding-top: 0;">
              <div v-for="(item,index) in orderDetail.goodsArr" :key="index" style="display: flex;">
                <span>
                  <img style="margin-right: 5px;width: 100px;height: 60px;" :src="item.imgUrl" alt="">
                </span>
                <span style="margin-left: 20px;width: 60%;">
                  <div style="margin-top: 6px;margin-bottom: 10px;">{{item.name}}</div>
                  <div>x{{item.count}}</div>
                </span>
                <span style="margin-left: auto;margin-top: 22px;text-align: right;width: 12%;">￥{{item.price}}</span>
              </div>
              <div style="display: flex;margin-top: 20px;">包装费
                <span style="margin-left: auto;">￥{{orderDetail.packingCharges}}</span>
              </div>
              <div style="display: flex;margin-top: 10px;">
                <div>配送费</div>
                <span style="margin-left: auto;">
                  <span style="color:#A9A9A9;text-decoration: line-through;margin-right: 5px;">￥{{orderDetail.distributionFee}}</span>￥{{orderDetail.totalDistributionFee}}
                </span>
              </div>
              <el-divider></el-divider>
              <div style="display: flex;text-align: right;">
                <span style="margin-left: auto;">合计<span style="margin-left: 5px;font-weight: bold;font-size: 18px;">￥{{orderDetail.total}}</span></span>
              </div>
              <el-divider></el-divider>
              <div style="font-size: 20px;font-weight: bold;">配送信息</div>
              <el-divider></el-divider>
              <div style="display: flex;">
                <span style="">期望时间</span>
                <span style="margin-left: auto;">{{orderDetail.sendTime}}</span>
              </div>
              <div style="display: flex;">
                <span style="">配送地址</span>
                <span style="margin-left: auto;width: 76%;text-align: right;">
                  <div>{{orderDetail.address.addressName}}{{orderDetail.address.doorNumber}}</div>
                  <div>{{orderDetail.address.userName}}
                    <span v-show="orderDetail.address.gender&&orderDetail.address.gender!=''">（
                    </span>{{orderDetail.address.gender}}
                    <span v-show="orderDetail.address.gender&&orderDetail.address.gender!=''">）
                    </span>&nbsp&nbsp{{orderDetail.address.phone}}
                  </div>
                </span>
              </div>
              <div style="display: flex;">
                <span style="">配送服务</span>
                <span style="margin-left: auto;">吃了没专送</span>
              </div>
              <el-divider></el-divider>
              <div style="font-size: 20px;font-weight: bold;">订单信息</div>
              <el-divider></el-divider>
              <div style="display: flex;">
                <span style="">订单编号</span>
                <span style="margin-left: auto;">{{orderDetail._id}}</span>
              </div>
              <div style="display: flex;">
                <span style="">下单时间</span>
                <span style="margin-left: auto;">{{orderDetail.date}}</span>
              </div>
              <div style="display: flex;">
                <span style="">支付方式</span>
                <span style="margin-left: auto;">在线支付</span>
              </div>
              <div style="display: flex;" v-show="orderDetail.orderComments!=''">
                <span style="">订单备注</span>
                <span style="margin-left: auto;">{{orderDetail.orderComments}}</span>
              </div>
              <div style="display: flex;" v-show="orderDetail.dinnerware!=''">
                <span style="">用餐人数</span>
                <span style="margin-left: auto;">{{orderDetail.dinnerware}}人</span>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import common from '../../assets/js/common'
  import store from '../../vuex'

  export default {
    name: "order",
    data() {
      return {
        orderShow: true,
        orderDialog: false,
        orderArr: [],
        orderDetail: {
          imgUrl: '',
          shopName: '',
          goodsArr: [],
          packingCharges: '',
          distributionFee: '',
          totalDistributionFee: '',
          total: '',
          sendTime: '',
          address: {
            addressName: '',
            doorNumber: '',
            userName: '',
            gender: '',
            phone: '',
          },
          date: '',
          totalLength: '',
          orderComments: '',
          dinnerware: '',
        },
      }
    },
    created() {
      this.query()
    },
    methods: {
      // 查询
      query() {
        axios.get('/api/account/getAccount').then((res) => {
          // 响应成功回调
          if (res.status == 200) {
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].userName == store.state.userName) {
                if (res.data[i].order.length == 0) {
                  this.orderShow = false
                } else {
                  this.orderArr = res.data[i].order
                  for (let j = 0; j < this.orderArr.length; j++) {
                    console.log(this.orderArr[j]);
                    this.orderArr[j].imgUrl = common.getImgUrl(this.orderArr[j].imgUrl)
                    for (let k = 0; k < this.orderArr[j].goodsArr.length; k++) {
                      this.orderArr[j].goodsArr[k].imgUrl = common.getImgUrl(this.orderArr[j].goodsArr[k].imgUrl)
                    }
                  }
                  this.orderShow = true
                }
              }
            }
          }
        })
      },
      // 去下单
      goOrder() {
        this.$router.push({
          path: '/firstPage'
        })
      },
      // 查看详细订单
      goOrderDetail(index) {
        this.orderDetail = this.orderArr[index]
        console.log(this.orderDetail.goodsArr);
        this.orderDialog = true
      },
      // 再来一单
      goMore(name) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
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
  .order-not-order {
    width: 1000px;
    height: 600px;
    margin-left: 20%;
    margin-top: 4%;
    background-image: url("../../assets/img/order/bg.png");
    background-size: 100% 100%;
    text-align: center;
  }
  >>>.el-dialog--center .el-dialog__body{
    padding: 0;
  }
  >>>.el-divider--horizontal{
    margin: 14px 0;
  }
  >>> .el-dialog__header {
    background-color: #409EFF;
  }

  >>> .el-dialog__body {
    padding: 0;
  }

  >>> .el-dialog__title {
    color: #fff;
    font-size: 25px;
    letter-spacing: 3px;
    font-weight: bold;
  }

  >>> .el-dialog__close {
    color: #fff;
  }
</style>
