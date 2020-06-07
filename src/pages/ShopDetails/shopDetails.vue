<template>
  <div>
    <el-container v-for="(item,index) in shopDetails" :key="index">
      <div v-show="searchInputShow" class="searchInput" style="">
        <i class="el-icon-search" style="" @click="getSearch('-1')"></i>
        <el-input style="" placeholder="想吃什么搜一搜" v-model="searchInput" clearable></el-input>
      </div>
      <el-header class="detailHeader">
        <span style="position: absolute;right: 0;">
          <i class="el-icon-search detailHeader-icon" @click="searchInputShow = true"></i>
          <i @click="goCollection()"
             :class="{'el-icon-star-off':beforeCollection,'el-icon-star-on':afterCollection,'detailHeader-icon':true,'detailHeader-icon-afterCollection':afterCollection}"></i>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link"><i class="el-icon-more detailHeader-icon"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-share" @click.native="shareToQQ()">分享到QQ</el-dropdown-item>
              <el-dropdown-item icon="el-icon-share" @click.native="shareToMicroblog()">分享到微博</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-header>
      <el-main style="padding-bottom: 0;">
        <el-container>
          <el-header class="detail-main-header">
            <div style="font-size: 60px;font-weight: bold;letter-spacing: 10px">{{shopName}}</div>
            <div>
              <span class="shopLabel"><i class="el-icon-time"></i>配送约{{item.time}}分钟</span>
              <span class="shopLabel"><i class="el-icon-tableware"></i>放心吃</span>
              <span style="border-right: none" class="shopLabel"><i class="el-icon-sunny"></i>热情掌柜</span>
            </div>
            <div>
              <el-collapse style="margin-left: 46%;border: none;">
                <el-collapse-item title="食品安全有保障">
                  <div class="detail-activeTitle">服务</div>
                  <div class="detail-active-detail">该商户已购买食品安全责任险，食品安全有保障</div>
                  <div class="detail-activeTitle">公告</div>
                  <div class="detail-active-detail">真诚服务，感恩收获！</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-header>
          <el-main style="padding-bottom: 0;" :style="footerShow?marginBottom='60px':''">
            <el-tabs v-model="activeName" @tab-click="handleClick()">
              <el-tab-pane label="点餐" name="first">
                <el-container style="height: 700px; border: 1px solid #eee;overflow: hidden;">
                  <el-aside width="200px" style="background-color: rgba(238,241,246,0.4);" class="menuScroll">
                    <ul v-for="(menuItem,menuIndex) in item.dishes" :key="menuIndex">
                      <li>
                        <i style="color:#f00;font-weight: bold;position: absolute;left: 50px;top: 26px;" :class="[menuIndex==0?'el-icon-magic-stick':'']"></i>
                        <a :href="'#'+menuIndex" :class="menuIndex==0?'activeMenu':''" @click="goMenu($event)">{{menuItem.dishType}}</a>
                      </li>
                    </ul>
                  </el-aside>
                  <el-main style="padding: 0;" ref="dishesRef">
                    <el-container v-for="(dishesItem,dishesIndex) in item.dishes" :key="dishesIndex" @scroll="dishScroll">
                      <el-header :id="dishesIndex" class="dishTitle" style="height: 20px;line-height: 20px;margin-top: 10px;font-weight: bold;color: #888;letter-spacing: 3px">{{dishesItem.dishType}}</el-header>
                      <el-main style="margin-top: 10px;padding-top: 0;padding-bottom: 0;">
                          <el-container style="cursor: pointer" v-for="(dishesMainItem,dishesMainIndex) in dishesItem.foods" :key="dishesMainIndex" @click.native="getSearch(dishesMainItem)">
                            <el-aside width="200px">
                              <img style="width: 100%;height: 112px;" :src="dishesMainItem.imgUrl" alt="">
                            </el-aside>
                            <el-main style="padding: 10px 20px">
                              <div style="font-weight: bold;font-size: 26px;">{{dishesMainItem.name}}</div>
                              <div style="color:#888;font-size: 16px;margin-top: 10px;">
                                月售{{dishesMainItem.sell}}
                              </div>
                              <div style="margin-top: 10px;display: flex;">
                                <span style="color: #f00;font-weight: bold;font-size: 22px;">￥{{dishesMainItem.price}}</span>
                                <span v-if="dishesMainItem.count!=0" style="margin-left: auto;font-size: 18px;">
                              <i style="color:#409EFF;font-size: 22px;margin-right: 3px;cursor:pointer;"
                                 class="el-icon-remove-outline" @click="subtractGoods(dishesIndex,dishesMainIndex)"></i>{{dishesMainItem.count}}
                            </span>
                                <span :style="{marginLeft:(dishesMainItem.count==0?'auto':'3px')}">
                              <i style="color:#409EFF;font-size: 22px;cursor:pointer;" class="el-icon-circle-plus"
                                 @click="addGoods(dishesIndex,dishesMainIndex)"></i>
                            </span>
                              </div>
                            </el-main>
                          </el-container>
                      </el-main>
                    </el-container>
                  </el-main>
                </el-container>
              </el-tab-pane>
              <el-tab-pane label="商家" name="second">
                <el-container>
                  <el-header
                    style="font-weight: bold;font-size: 30px;letter-spacing: 5px;line-height: 60px;height: 80px;border-bottom: 10px solid rgba(240,240,240,0.3);">
                    商家信息
                  </el-header>
                  <el-main>
                    <div class="shopInfo" style="">
                      <span class="shopLeft">商家名称</span>
                      <span style="margin-left: auto;">{{item.name}}</span>
                    </div>
                    <el-divider></el-divider>
                    <div class="shopInfo" style="">
                      <span class="shopLeft">商家品类</span>
                      <span style="margin-left: auto;">{{item.shopType}}</span>
                    </div>
                    <el-divider></el-divider>
                    <div class="shopInfo" style="">
                      <span class="shopLeft">商家地址</span>
                      <span style="margin-left: auto;">{{item.address}}</span>
                    </div>
                    <el-divider></el-divider>
                    <div class="shopInfo" style="">
                      <span class="shopLeft">商家电话</span>
                      <span style="margin-left: auto;">{{item.phone}}</span>
                    </div>
                    <el-divider></el-divider>
                    <div class="shopInfo" style="">
                      <span class="shopLeft">营业时间</span>
                      <span style="margin-left: auto;">{{item.businessHours}}</span>
                    </div>
                  </el-main>
                </el-container>
                <el-container>
                  <el-header
                    style="font-weight: bold;font-size: 30px;letter-spacing: 5px;line-height: 60px;height: 60px;border-top: 10px solid rgba(240,240,240,0.3);">
                    商家服务
                  </el-header>
                  <el-main style="display: flex">
                    <div style="border: 1px solid #F5F5F5;padding: 2px;font-size: 10px;">保</div>
                    &nbsp&nbsp该商户已购买食品安全责任险，食品安全有保障
                  </el-main>
                </el-container>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-main>
      <el-footer v-show="footerShow" :style="{backgroundColor:(goodsArr.length==0?'#696969':'#232323')}"
                 style="width: 100%;padding: 0;position: fixed;bottom: 0;z-index: 21;">
        <div style="display: flex">
          <div @click="checkGoods()" style="display: flex;cursor:pointer;">
            <div
              :style="{border:(goodsArr.length==0?'6px solid #696969':'6px solid #232323'),backgroundColor:(goodsArr.length==0?'#888':'#232323')}"
              style="height: 60px;width: 65px;margin-left: 30px;margin-top: -20px;z-index: 20;border-radius: 50%;">
              <i :style="{color:(goodsArr.length==0?'':'#409EFF')}"
                 style="font-size: 45px;margin-left: 20%;line-height: 60px;" class="iconfont iconai-cart"></i>
            </div>
            <div style="margin-left: 20px;">
              <div style="margin: 2px 0;font-size: 20px;color:#fff;">￥{{allPrice}}</div>
              <div style="color:#A9A9A9;">配送费￥{{distributionFee}}元</div>
            </div>
          </div>
          <el-button class="footer-button" :style="{backgroundColor:(allPrice<20?'#888':'#00FF00')}"
                     @click="goSubmitOrder(shopName)">{{submitText}}
          </el-button>
        </div>
      </el-footer>
    </el-container>

    <!--弹窗-->
    <el-dialog
      center
      title="查看菜品"
      :visible.sync="dishDetailsDialog"
      width="40%"
      style="font-weight: bold;">
      <div style="margin-top: 20px">
        <el-container v-for="(item,index) in dishDetails" :key="index">
          <el-aside width="200px">
            <img style="width: 90%;height: 112px;margin-left: 6%;" :src="item.imgUrl" alt="">
          </el-aside>
          <el-main style="padding: 10px 20px">
            <div style="font-weight: bold;font-size: 26px;">{{item.name}}</div>
            <div style="color:#888;font-size: 16px;margin-top: 10px;">月售{{item.sell}}&nbsp&nbsp&nbsp好评{{item.praise}}%
            </div>
            <div style="margin-top: 10px;display: flex;">
              <span style="color: #f00;font-weight: bold;font-size: 22px;">￥{{item.price}}</span>
              <span v-if="item.count!=0" style="margin-left: auto;font-size: 18px;">
                              <i style="color:#409EFF;font-size: 22px;margin-right: 3px;cursor:pointer;"
                                 class="el-icon-remove-outline" @click="subtractGoods(0,index)"></i>{{item.count}}
                            </span>
              <span :style="{marginLeft:(item.count==0?'auto':'3px')}">
                              <i style="color:#409EFF;font-size: 22px;cursor:pointer;" class="el-icon-circle-plus"
                                 @click="addGoods(0,index)"></i>
                            </span>
            </div>
          </el-main>
        </el-container>
      </div>
    </el-dialog>
    <!--选好的商品-->
    <el-dialog
      center
      title="已选商品"
      :visible.sync="goodsDialogVisible"
      width="40%"
      style="font-weight: bold;">
      <div style="background-color: rgba(245,245,245,0.8)">
        <div style="width: 100%;background-color: #F5F5F5;padding-bottom: 20px;">
          <div style="display: flex;padding: 10px 20px">
            <el-popover
              style="margin-left: auto;"
              placement="top"
              width="160"
              v-model="emptyVisible">
              <p>确定清空吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="emptyVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="goEmpty()">确定</el-button>
              </div>
              <i style="cursor:pointer;" slot="reference" class="el-icon-delete">清空</i>
            </el-popover>
          </div>
          <div style="background-color: #fff;">
            <div v-for="(item,index) in goodsArr" :key="index" style="padding: 10px 20px;display: flex;"
                 :style="{borderTop:(index==0?'':'1px solid #F5F5F5')}">
              {{item.name}}
              <div style="margin-left: auto;">
                <span style="color: #f00;margin-right: 6px;">￥{{item.price}}</span>
                <i class="el-icon-remove-outline" style="color:#409EFF;margin: 0 4px;font-size: 20px;cursor:pointer;"
                   @click="subtractGoods(0,index)"></i>{{item.count}}
                <i style="color:#409EFF;font-size: 20px;margin-left: 4px;cursor:pointer;"
                   class="el-icon-circle-plus-outline" @click="addGoods(0,index)"></i>
              </div>
            </div>
          </div>
          <div style="background-color: #fff;margin-top: 10px;">
            <div style="display: flex;padding: 10px 20px">包装费<span style="margin-left: auto;color:#f00;">￥{{packingCharges}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import common from '../../assets/js/common'
  import store from '../../vuex'

  export default {
    name: "shopDetails",
    data() {
      return {
        shopName: '',
        searchInput: '',
        searchInputShow: false,
        shopDetails: [],
        beforeCollection: false,
        afterCollection: false,
        activeName: 'first',
        allPrice: 0,
        footerShow: true,
        goodsDialogVisible: false,
        showClose: false,
        emptyVisible: false,
        goodsArr: [],
        packingCharges: 0,
        distributionFee: '',
        submitText: '￥20元起送',
        dishDetailsDialog: false,
        dishDetails: [],
      }
    },
    created() {
      this.getParams()
      this.query()
    },
    watch: {
      '$route': 'getParams',
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.$nextTick(() => {
        // console.log(this.$refs.dishesRef.getBoundingClientRect().top);
        for (let i = 0; i < document.getElementsByClassName('dishTitle').length; i++) {
          console.log(document.getElementsByClassName('dishTitle')[i].offsetTop);
          // console.log(document.getElementsByClassName('dishTitle')[i].clientTop);
          // console.log(document.getElementsByClassName('dishTitle')[i].scrollTop);
        }
      })
    },
    methods: {
      query() {
        axios.get('/api/account/getAccount').then((res) => {
          // 响应成功回调
          console.log(res)
          for (let i = 0; i < res.data.length; i++) {
            if (store.state.userName == res.data[i].userName) {
              for (let j = 0; j < res.data[i].shops.length; j++) {
                if (res.data[i].shops[j].name == this.shopName) {
                  for (let k = 0; k < res.data[i].shops[j].dishes.length; k++) {
                    for (let l = 0; l < res.data[i].shops[j].dishes[k].foods.length; l++) {
                      if (res.data[i].shops[j].dishes[k].foods[l].count > 0) {
                        this.goodsArr.push(res.data[i].shops[j].dishes[k].foods[l])
                      }
                      res.data[i].shops[j].dishes[k].foods[l].imgUrl  = common.getImgUrl(res.data[i].shops[j].dishes[k].foods[l].imgUrl)
                    }
                    this.shopDetails = [res.data[i].shops[j]]
                    this.shopDetails[0].collect == 0 ? this.beforeCollection = true : this.afterCollection = true;
                    axios.get('/api/shops/getShops').then((res) => {
                      // 响应成功回调
                      for (let l = 0; l < res.data.length; l++) {
                        if (res.data[l].name == this.shopName) {
                          for (let m = 0; m < res.data[l].dishes.length; m++) {
                            for (let n = 0; n < res.data[l].dishes[m].foods.length; n++) {
                              this.shopDetails[0].dishes[m].foods[n].sell = res.data[l].dishes[m].foods[n].sell
                            }
                          }
                        }
                      }
                    })
                    this.distributionFee = this.shopDetails[0].distributionFee
                    let number = 0
                    this.goodsArr.forEach(item => {
                      number += item.count
                    })
                    this.packingCharges = (number * 0.4).toFixed(1)
                    this.getSubmitText()
                  }
                }
              }
            }
          }
        })
      },
      handleScroll() {
        if (document.documentElement.scrollTop > 0) {
          this.searchInputShow = true;
        } else {
          this.searchInputShow = false;
        }
      },
      getSearch(item) {
        console.log(item);
        this.dishDetails = []
        if (item != '-1') {
          this.dishDetails.push(item)
          this.dishDetailsDialog = true
        } else {
          axios.get('/api/account/getAccount').then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              if (store.state.userName == res.data[i].userName) {
                for (let j = 0; j < res.data[i].shops.length; j++) {
                  if (res.data[i].shops[j].name == this.shopName) {
                    this.shopDetails = [res.data[i].shops[j]]
                    for (let k = 0; k < this.shopDetails[0].dishes.length; k++) {
                      for (let l = 0; l < this.shopDetails[0].dishes[k].foods.length; l++) {
                        this.shopDetails[0].dishes[k].foods[l].imgUrl = common.getImgUrl(this.shopDetails[0].dishes[k].foods[l].imgUrl)
                        if (this.shopDetails[0].dishes[k].foods[l].name.indexOf(this.searchInput) != -1) {
                          this.dishDetails.push(this.shopDetails[0].dishes[k].foods[l])
                          this.dishDetailsDialog = true
                        }
                      }
                    }
                  }
                }
              }
            }
          })
        }
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.shopName
        // 将数据放在当前组件的数据内
        console.log(routerParams);
        this.shopName = routerParams
      },
      goCollection() {
        if (this.beforeCollection === true) {
          this.beforeCollection = false
          this.afterCollection = true
          this.shopDetails[0].collect = 1
          let parms = {
            userName: store.state.userName,
            shops: this.shopDetails[0]
          }
          axios.put('/api/shops/changeShops', parms).then((res) => {
            console.log(res);
          }).catch(err => console.log(err));
        } else {
          this.beforeCollection = true
          this.afterCollection = false
          this.shopDetails[0].collect = 0
          let parms = {
            userName: store.state.userName,
            shops: this.shopDetails[0]
          }
          axios.put('/api/shops/changeShops', parms).then((res) => {
            console.log(res);
          }).catch(err => console.log(err));
        }
      },
      // 分享到QQ
      shareToQQ() {
        //此处分享链接内无法携带图片
        const share = {
          title: "吃了没",
          desc: "这是一个外卖订餐系统",
          share_url: "http://localhost:8080"
        };
        location.replace(
          "https://connect.qq.com/widget/shareqq/index.html?url=" +
          encodeURIComponent(share.share_url) +
          "&title=" +
          share.title +
          "&desc=" +
          share.desc
        );
      },
      //分享到微博(可用)
      shareToMicroblog() {
        //自定义内容
        const share = {
          title: "吃了没",
          share_url: "http://localhost:8080"
        };
        //跳转地址
        location.replace(
          "https://service.weibo.com/share/share.php?url=" +
          encodeURIComponent(share.share_url) +
          "&title=" +
          share.title
        );
      },
      handleClick(tab, event) {
        this.activeName == 'first' ? this.footerShow = true : this.footerShow = false
        console.log(tab, event);
      },
      goMenu(e) {
        for (let i = 0; i < document.getElementsByClassName('activeMenu').length; i++) {
          document.getElementsByClassName('activeMenu')[i].className = ''
        }
        e.target.className = 'activeMenu'
      },
      dishScroll() {
        // console.log(this.$refs.dishesRef.scrollTop);
        // console.log(this.$refs.dishesRef.offsetTop);
        // this.$el.querySelector('.dishTitle').offsetTop

        // for (let i = 0; i < document.getElementsByClassName('.dishTitle').length; i++) {
        // console.log(document.getElementsByClassName('.dishTitle')[i].offsetTop);
        // console.log(document.getElementsByClassName('.dishTitle')[i].clientTop);
        // console.log(document.getElementsByClassName('.dishTitle')[i].scrollTop);
        // }
      },
      // 清空
      goEmpty() {
        this.goodsDialogVisible = false
        this.emptyVisible = false
        this.goodsArr = []
        for (let i = 0; i < this.shopDetails[0].dishes.length; i++) {
          for (let j = 0; j < this.shopDetails[0].dishes[i].foods.length; j++) {
            this.shopDetails[0].dishes[i].foods[j].count = 0
          }
        }
        let parms = {
          userName: store.state.userName,
          shops: this.shopDetails[0]
        }
        axios.put('/api/shops/changeShops', parms).then((res) => {
          console.log(res);
        }).catch(err => console.log(err));
        this.packingCharges = 0
        this.allPrice = 0
        this.submitText = '￥20元起送'
      },
      addGoods(index1,index2) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        if (this.goodsDialogVisible == false) {
          let flag = true
          let goods
          if (this.dishDetailsDialog == false) {
            this.shopDetails[0].dishes[index1].foods[index2].count += 1
            goods = this.shopDetails[0].dishes[index1].foods[index2]
          } else {
            this.dishDetails[index2].count += 1
            goods = this.dishDetails[index2]
            // for (let i = 0; i < this.shopDetails[0].dishes.length; i++) {
            //   if (goods.name == this.shopDetails[0].dishes[i].name) {
            //     this.shopDetails[0].dishes[i].count += 1
            //   }
            // }
          }
          if (this.goodsArr.length == 0) {
            flag = true
          } else {
            for (let i = 0; i < this.goodsArr.length; i++) {
              if (this.goodsArr[i].name == goods.name) {
                flag = false
                this.goodsArr[i].count = goods.count
              }
            }
          }
          if (flag) {
            this.goodsArr.push({imgUrl: goods.imgUrl, name: goods.name, price: goods.price, count: goods.count})
          }
        } else {
          this.goodsArr[index2].count += 1
          for (let i = 0; i < this.shopDetails[0].dishes.length; i++) {
            for (let j = 0; j < this.shopDetails[0].dishes[i].foods.length; j++) {
              if (this.goodsArr[index2].name == this.shopDetails[0].dishes[i].foods[j].name) {
                this.shopDetails[0].dishes[i].foods[j].count += 1
              }
            }
          }
        }
        let parms = {
          userName: store.state.userName,
          shops: this.shopDetails[0]
        }
        axios.put('/api/shops/changeShops', parms).then((res) => {
          console.log(res);
        }).catch(err => console.log(err));
        let number = 0
        this.goodsArr.forEach(item => {
          number += item.count
        })
        this.packingCharges = (number * 0.4).toFixed(1)
        this.getSubmitText()
      },
      subtractGoods(index1,index2) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        if (this.goodsDialogVisible == false) {
          let goods
          if (this.dishDetailsDialog == false) {
            goods = this.shopDetails[0].dishes[index1].foods[index2]
          } else {
            goods = this.dishDetails[index2]
            // this.shopDetails[0].dishes.forEach(item => {
            //   if (item.name == goods.name) {
            //     goods.count == 1 ? item.count = 0 : item.count -= 1
            //   }
            // })
          }
          if (goods.count == 1) {
            goods.count = 0
          } else {
            goods.count -= 1
          }
          for (let i = 0; i < this.goodsArr.length; i++) {
            if (goods.name == this.goodsArr[i].name) {
              if (goods.count == 0) {
                this.goodsArr.splice(i, 1)
              } else {
                this.goodsArr[i].count = goods.count
              }
            }
          }
        } else {
          for (let i = 0; i < this.shopDetails[0].dishes.length; i++) {
            for (let j = 0; j < this.shopDetails[0].dishes[i].foods.length; j++) {
              if (this.shopDetails[0].dishes[i].foods[j].name == this.goodsArr[index2].name) {
                this.goodsArr[index2].count == 1 ? this.shopDetails[0].dishes[i].foods[j].count = 0 : this.shopDetails[0].dishes[i].foods[j].count -= 1
              }
            }
          }
          this.goodsArr[index2].count == 1 ? this.goodsArr.splice(index2, 1) : this.goodsArr[index2].count -= 1
        }
        if (this.goodsArr.length == 0) {
          this.goodsDialogVisible = false
          this.packingCharges = 0
        } else {
          let number = 0
          this.goodsArr.forEach(item => {
            number += item.count
          })
          this.packingCharges = (number * 0.4).toFixed(1)
        }
        let parms = {
          userName: store.state.userName,
          shops: this.shopDetails[0]
        }
        axios.put('/api/shops/changeShops', parms).then((res) => {
          console.log(res);
        }).catch(err => console.log(err));
        this.getSubmitText()
      },
      checkGoods() {
        if (this.goodsArr.length > 0) {
          this.goodsDialogVisible == false ? this.goodsDialogVisible = true : this.goodsDialogVisible = false
        } else {
          this.goodsDialogVisible = false
        }
      },
      getSubmitText() {
        let all = 0
        this.goodsArr.forEach(item => {
          all += item.price * item.count
        })
        this.allPrice = (Number(all) + Number(this.packingCharges)).toFixed(1)
        if (this.allPrice == 0) {
          this.submitText = '￥20元起送'
        } else if (this.allPrice < 20) {
          let price = (20 - this.allPrice).toFixed(1)
          this.submitText = '还差￥' + price + '起送'
        } else {
          this.submitText = '去结算'
        }
      },
      goSubmitOrder(shopName) {
        if (this.allPrice < 20) {
          this.$message({
            message: this.submitText + '，快去选择想吃的吧！',
            type: 'warning'
          });
        } else {
          this.$router.push({
            path: '/submitOrder',
            query: {
              shopName: shopName
            }
          })
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
      // document.removeEventListener('scroll', this.dishScroll);
    }
  }
</script>

<style scoped>
  .searchInput {
    display: flex;
    height: 40px;
    border-radius: 10px;
    background-color: #409EFF;
    position: fixed;
    top: 0;
    width: 50%;
    z-index: 20;
    margin-left: 25%;
  }
  .searchInput i {
    font-size: 25px;
    line-height: 40px;
    cursor: pointer;
    margin-left: 30px;
    color: #fff;
  }
  >>> .searchInput .el-input__inner {
    border: none !important;
    font-size: 25px;
    height: 100%;
    background-color: transparent;
    color: #fff;
  }
  .detailHeader-icon {
    /*color: #fff;*/
    font-weight: bold;
    font-size: 20px;
    margin-right: 20px;
    margin-top: 20px;
    cursor: pointer;
  }
  .detailHeader-icon-afterCollection {
    color: #FF8C00 !important;
    /*font-size: 24px !important;*/
  }
  .detail-main-header {
    height: 160px !important;
    text-align: center;
  }
  .shopLabel {
    display: inline-block;
    padding-right: 20px;
    margin-right: 20px;
    margin-top: 20px;
    border-right: 1px solid rgba(136, 136, 136, 0.3);
  }
  .shopLabel i {
    margin-right: 5px;
  }
  >>> .el-collapse-item__header {
    border-bottom: none;
    color: #888;
  }
  >>> .el-collapse-item__arrow {
    margin-left: 0 !important;
  }
  >>> .el-collapse-item__wrap {
    margin-left: -84%;
    z-index: 500;
    position: relative;
    top: 0;
  }
  >>> .el-collapse-item__content {
    text-align: left;
    margin-left: 30%;
  }
  .detail-activeTitle {
    font-weight: bold;
    font-size: 18px;
  }
  .detail-active-detail {
    color: #888;
    margin-bottom: 10px;
  }
  >>> .el-tabs__nav {
    margin-left: 40%;
  }
  >>> .el-tabs__header {
    margin: 0;
  }
  >>> .el-tabs__item {
    font-size: 18px;
  }
  .activeMenu{
    background-color: #EDF6FF;
    color: #409EFF !important;
  }
  .menuScroll ul{
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
  .menuScroll li:hover,ul li a:hover{
    background-color: #EDF6FF;
  }
  .menuScroll li:focus,ul li a:focus{
    color: #409EFF !important;
  }
  .menuScroll ul li{
    list-style: none;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
  }
  .menuScroll ul li a{
    text-decoration: none;
    color: #333;
    display: inline-block;
    padding: 20px 0;
    width: 200px;
  }

  >>> .el-tabs__content {
    margin-bottom: 60px;
  }

  .footer-button {
    margin-left: auto;
    height: 60px;
    width: 20%;
    border: none;
    border-radius: 0;
    color: #fff;
    font-size: 20px;
  }

  .shopInfo {
    display: flex;
  }

  .shopLeft {
    font-size: 22px;
    letter-spacing: 2px;
  }

  .shopInfo span:nth-child(2) {
    color: #5B5B5B;
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
