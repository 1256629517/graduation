<template>
  <div>
    <el-container style="background-color: rgba(250,250,250,1);">
      <el-header style="background:linear-gradient(180deg,rgba(64,158,255,1),rgba(250,250,250,1));height: 220px;">
        <el-container>
          <el-header ref="orderTitleBg" @click.native="getTitleAddress"
                     style="width: 100%;position: fixed;top: 0;left: 0;z-index: 2;text-align: center;padding-top: 5px;font-size: 30px;letter-spacing: 4px;color:#000;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            {{orderTitle}}<i v-show="scrollShow" class="el-icon-arrow-right"></i>
          </el-header>
          <el-main style="background-color: #fff;margin-top: 60px">
            <div style="display: flex;cursor: pointer;" @click="addressDrawer = true">
              <span v-show="chooseAddress">选择收货地址</span>
              <span v-show="!chooseAddress">
                <div>{{address.addressName}}{{address.doorNumber}}</div>
                <div>{{address.userName}}<span v-show="address.gender&&address.gender!=''">（</span>{{address.gender}}<span
                  v-show="address.gender&&address.gender!=''">）</span>&nbsp&nbsp{{address.phone}}</div>
              </span>
              <i style="margin-left: auto;" class="el-icon-arrow-right"></i>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;cursor: pointer;" @click="sendTimeDialog = true">
              <span>{{sendTime}}</span>
              <span style="margin-left: auto;">{{arrivalTime}}<i style="margin-left: auto;"
                                                                 class="el-icon-arrow-right"></i></span>
            </div>
          </el-main>
        </el-container>
      </el-header>
      <el-main style="overflow: inherit;padding: 0 20px 20px;margin-bottom: 60px;">
        <el-container>
          <el-header style="background-color: #fff;">
            <div style="display: flex;margin-top: 20px;">
              {{shopName}}
              <span class="shopsLogo">吃了没专送</span>
            </div>
            <el-divider style="margin: 10px 0;"></el-divider>
          </el-header>
          <el-main style="background-color: #fff;">
            <div v-for="(item,index) in goodsArr" style="display: flex;">
              <span>
                <img style="margin-right: 5px;width: 100px;height: 60px;" :src="item.imgUrl" alt="">
              </span>
              <span style="margin-left: 20px;">
                <div style="margin-top: 6px;margin-bottom: 10px;">{{item.name}}</div>
                <div>x{{item.count}}</div>
              </span>
              <span style="margin-left: auto;margin-top: 22px;">￥{{item.price}}</span>
            </div>
            <div style="display: flex;margin-top: 20px;">包装费
              <span style="margin-left: auto;">￥{{packingCharges}}</span>
            </div>
            <div style="display: flex;margin-top: 10px;">
              <span>
                <div>配送费</div>
                <div style="color: #A9A9A9;font-size: 10px;">已减去{{distributionFee}}元配送费</div>
              </span>
              <span style="margin-left: auto;">
                <span style="color:#A9A9A9;text-decoration: line-through;margin-right: 5px;">￥{{distributionFee}}</span>￥{{totalDistributionFee}}
              </span>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;text-align: right;">
              <span style="color: #A9A9A9;cursor:pointer;">优惠说明<i class="el-icon-question"></i></span>
              <span style="margin-left: auto;">小计<span style="margin-left: 5px;font-weight: bold;font-size: 20px;">￥{{total}}</span></span>
            </div>
          </el-main>
          <div style="background-color: #fff;margin: 20px 0;padding: 10px 20px ">
            <div style="display: flex;font-weight: bold;">食无忧
              <div
                style="padding: 4px;font-size: 10px;margin-left: auto;color:#409EFF;background-color: rgba(64,158,255,0.5);">
                商家赠送
              </div>
            </div>
            <div style="color: #A9A9A9;font-size: 10px;cursor:pointer;" @click="foodSafetyDialog = true">
              该商家已为您投保食品安全险，让您吃的更放心<i class="el-icon-question"></i></div>
          </div>
          <el-footer style="background-color: #fff;height: 100%;padding: 20px;">
            <div style="display: flex;cursor:pointer;">
              <span style="font-weight: bold;">订单备注</span>
              <div style="margin-left: auto;width: 50%;text-align: right" @click="orderCommentsDialog=true">{{orderComments}}<i
                style="color:#A9A9A9;" class="el-icon-arrow-right"></i></div>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;cursor:pointer;">
              <span style="font-weight: bold;">餐具数量</span>
              <el-dropdown style="margin-left: auto;" trigger="click" @command="handleCommand">
                <span ref="dinnerwareDropdown" style="color:#A9A9A9;">{{dinnerware}}<i style="color:#A9A9A9;"
                                                                                       class="el-icon-arrow-right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in dinnerwareArr" :command="item" :key="item">{{item}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;">
              <span style="font-weight: bold;">发票</span>
              <span style="margin-left: auto;color:#A9A9A9;">该店不支持线上开票，请联系商户</span>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;">
              <span style="font-weight: bold;">支付方式</span>
              <span style="margin-left: auto;">在线支付</span>
            </div>
            <el-divider></el-divider>
            <div>
              <div style="display: flex;">
                <span style="font-weight: bold;">号码保护</span>
                <el-switch style="margin-left: auto;" v-model="switchOpen"></el-switch>
              </div>
              <div style="color:#A9A9A9;font-size: 10px;" v-show="switchOpen">为保障用户隐私和服务质量，特使用匿名小号与商户、骑士联系，通话过程可能被录音
              </div>
            </div>
          </el-footer>
        </el-container>
      </el-main>
      <el-footer style="width: 100%;position: fixed;bottom: 0;display: flex;background-color: #232323;padding-right: 0">
        <div style="line-height: 60px;color: #696969;">
          <span style="color: #fff;font-size: 20px;">￥{{total}}</span>
          <el-divider direction="vertical"></el-divider>
          <span style="">已优惠￥{{preferential}}</span>
        </div>
        <el-button class="checkOrder" style="" @click="confirmPay()">确认支付</el-button>
      </el-footer>
    </el-container>

    <!-- 弹窗 -->
    <!-- 选择地址 -->
    <el-drawer
      title="选择收货地址"
      :visible.sync="addressDrawer"
      direction="btt">
      <div style="margin-bottom: 60px;">
        <div @click="confirmAddress(index)" v-for="(item,index) in addressArr" :key="index"
             style="display: flex;margin: 10px 20px;padding-bottom:10px;cursor:pointer;border-bottom: 1px solid rgb(230,230,230)">
          <span>
            <div style="font-weight: bold;">{{item.addressName}}&nbsp&nbsp{{item.doorNumber}}</div>
            <div>{{item.userName}}
              <span v-show="item.gender&&item.gender!=''">（</span>{{item.gender}}
              <span v-show="item.gender&&item.gender!=''">）</span>&nbsp&nbsp{{item.phone}}
            </div>
          </span>
          <span style="margin-left: auto;margin-top: 1%;">
            <el-button :title="'编辑'" @click.native.prevent="editAddress(index)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </span>
        </div>
      </div>
      <el-button type="primary" style="position: fixed;bottom: 10px;margin-left: 30%;width: 30%;"
        @click="addAddressDialog=true" icon="el-icon-circle-plus-outline">新增收获地址
      </el-button>
    </el-drawer>

    <el-dialog
      class="addressDialog"
      @closed="addressDialogClosed()"
      :title="addAddressDialog?'新增地址':'编辑地址'"
      :visible.sync="addressDialog"
      width="40%">
      <el-form ref="addTagInfo" :model="addressForm" label-width="80px" label-position="left">
        <el-divider></el-divider>
        <el-form-item label="联系人">
          <el-input v-model="addressForm.userName" placeholder="姓名" clearable></el-input>
          <el-divider></el-divider>
          <div>
            <el-button @click="chooseGender($event)" :type="genderOne" plain>先生</el-button>
            <el-button @click="chooseGender($event)" :type="genderTwo" plain>女士</el-button>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="电话">
          <el-input v-model="addressForm.phone" maxlength="11" placeholder="手机号码" clearable></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="地址" @click.native="getAddress()">
          <div style="display: flex;cursor:pointer;font-size: 20px;color:#000;padding-left: 15px;">
            <span>{{addressForm.addressName}}</span>
            <i style="margin-left: auto;margin-top: 10px;" class="el-icon-arrow-right"></i>
          </div>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="门牌号">
          <el-input v-model="addressForm.doorNumber" placeholder="例：X号楼X室" clearable></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-button class="addressButton" type="primary" @click="goSaveAddress('addTagInfo')">保存并使用</el-button>
      </el-form>
    </el-dialog>

    <!-- 选择送达时间 -->
    <el-dialog
      class="sendTimeDialog"
      center
      title="选择预定送达时间"
      :visible.sync="sendTimeDialog"
      width="40%"
      style="font-weight: bold;">
      <el-tabs tab-position="left" style="height: 300px;overflow-y: scroll">
        <el-tab-pane :label="today">
          <div v-for="(item,index) in todayTimeArr" :key="item+index" style="cursor: pointer;margin-bottom: 2px;"
               @click="todayTabClick(index)">
            {{item.hour+":"+item.min+"（"+item.price+"元配送费）"}}<i v-show="item.show" style="color: #409EFF"
                                                                class="el-icon-success"></i>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="tomorrow">
          <div v-for="(item,index) in tomorrowTimeArr" :key="item+index" style="cursor: pointer;margin-bottom: 2px;"
               @click="tomorrowTabClick(index)">
            {{item.hour+":"+item.min+"（"+item.price+"元配送费）"}}<i v-show="item.show" style="color: #409EFF"
                                                                class="el-icon-success"></i>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 优惠说明 -->
    <el-dialog
      center
      title="优惠说明"
      :visible.sync="preferentialExplanationDialog"
      width="30%"
      style="font-weight: bold;">
      <div style="margin-top: 20px">最大优惠
      </div>
    </el-dialog>

    <!-- 食无忧服务说明 -->
    <el-dialog
      center
      title="食无忧服务说明"
      :visible.sync="foodSafetyDialog"
      width="50%"
      style="font-weight: bold;">
      <el-collapse v-model="foodSafetyActiveNames">
        <el-collapse-item title="一、服务内容" name="1">
          <div>1.1用户(以下统称“您")
            在吃了没平台订餐消费后，如遇到餐品质量问题或食物中毒致病就医等在食品安全责任保险“食无忧"保障范围内的情况，可在吃了没平台发起保险索赔，由保险公司按照食品安全责任保险保障范围向您进行保险理赔。
          </div>
          <div>1.2保障范围</div>
          <div style="padding-left: 10px">
            <div>1.2.1致病就医:食物中毒、罹患其他食源性疾患;</div>
            <div>1.2.2食品异物:食品混杂异物;</div>
            <div>1.2.3食品腐烂变质:夹生、烧焦、变质等;</div>
            <div>1.2.4食品包装盒污染破损</div>
            <div>1.2.5食品过期:超过保质期</div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="二、服务使用须知" name="2">
          <div>2.1若您食用订单食品后，发生食品变质、存在异物类问题的，请您在订单支付成功后2天(48小时)
            内提交理赔申请;发生致病就医类问题的，请您在订单支付成功后27小时内就医，并在支付成功后15天(360小时)内提交理赔申请，具体理赔申请时效以保险公司实际承保内容为准。逾期申请理赔的，保险公司有权拒绝您的理赔申请要求。
          </div>
          <div>2.2您应保证，理赔时所填的信息(包括但不限于赔付原因、问题商品照片、收款方式、身份信息等)真实、准确、完整、详细。如因您提供的信息虚假、不完整、错误导致的任何责任或损失，由您自行承担。</div>
          <div>2.3您应对理赔事项的真实性负责,若发现您故意制造保险事故，或在未发生保险事故的前提下谎称发生了保险事故的，保险公司有权不予理赔，因此给吃了没及/或保险公司造成的损失由您自行承担。</div>
          <div>2.4您理解并同意，保险承保及理赔由保险公司负责，具体保障范围及最终理赔结果以保险公司向您提供的结果为准。</div>
          <div>
            2.5吃了没作为网络食品交易第三方平台提供者仅基于保险理赔向保险公司提供订餐数据支持，如您因保险理赔与保险公司发生争议的，相关争议事宜应由您自行与保险公司协商解决。您同意，当保险公司向您承保并支付完毕理赔款项后，即视为当次争议已处理完毕，您不再就该订单的餐品质量或食物中毒致病就医等问题向吃了没和/或商户主张任何权利或追索赔偿。
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>

    <!-- 填写订单备注 -->
    <el-dialog
      center
      title="订单备注"
      :visible.sync="orderCommentsDialog"
      width="30%"
      style="font-weight: bold;">
      <el-input
        type="textarea"
        rows="5"
        placeholder="请输入订单备注"
        v-model="orderTextarea"
        maxlength="50"
        show-word-limit
        @input="descInput">
      </el-input>
      <div style="margin-top: 20px">
        <div style="margin: 10px 0;">快捷输入</div>
        <div class="textareaButton">
          <el-button plain @click="getTextarea(item)" v-for="item in orderTextareaArr" :key="item">{{item}}</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOrderTextarea()">完 成</el-button>
        <el-button @click="orderCommentsDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import common from '../../assets/js/common'
  import store from '../../vuex'

  export default {
    name: "submitOrder",
    data() {
      return {
        orderTitle: '提交订单',
        scrollShow: false,
        shopName: '',
        goodsArr: [],
        packingCharges: 0,
        distributionFee: 0,
        totalDistributionFee: 0,
        preferentialExplanationDialog: false,
        foodSafetyDialog: false,
        foodSafetyActiveNames: '',
        total: 0,
        orderComments: '',
        orderCommentsDialog: false,
        orderTextarea: '',
        orderTextareaArr: ['不要辣椒', '少放辣椒', '多放辣椒', '不要香菜', '不要洋葱'],
        dinnerware: '未选择',
        dinnerwareArr: ['无需', '1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份','10份','10份以上'],
        switchOpen: true,
        preferential: '',
        // 选择地址
        addressDrawer: false,
        addAddressDialog: false,
        editAddressDialog: false,
        genderOne: '',
        genderTwo: '',
        // 添加/编辑的地址信息
        addTagInfo: {
          addressName: '',
          doorNumber: '',
          userName: '',
          gender: '',
          phone: '',
        },
        // 地址数据
        addressForm: {
          addressName: '',
          doorNumber: '',
          userName: '',
          gender: '',
          phone: '',
        },
        // 确认之后的地址
        address: {
          addressName: '',
          doorNumber: '',
          userName: '',
          gender: '',
          phone: '',
        },
        // 地址数组
        addressArr: [],
        chooseAddress: true,
        // 送达时间
        sendTime: '立即送出',
        arrivalTime: '',
        sendTimeDialog: false,
        today: '',
        tomorrow: '',
        todayTimeArr: [],
        tomorrowTimeArr: [
          {
            hour: '00',
            min: '00',
            price: 5,
            show: false
          },
          {
            hour: '00',
            min: '30',
            price: 5,
            show: false
          },
          {
            hour: '01',
            min: '00',
            price: 5,
            show: false
          },
        ],
        // 地图地址
        locationData: {
          // 用于定位相关信息提交
          lat: "", // 纬度
          lon: "", // 经度
          province: "", // 省
          city: "", // 市
          district: "", // 区 县
          nowPlace: "", // 省-市-区
          Address: "" // 详细地址
        },
        shopDetails: [],
        imgUrl: '',
      }
    },
    created() {
      this.query()
      this.getAllAddress()
      this.getArrivalTime()
      this.getParams()
      this.getLocation()
    },
    computed: {
      addressDialog: {
        get() {
          return this.addAddressDialog || this.editAddressDialog;
        },
        set() {
          this.addAddressDialog = false;
          this.editAddressDialog = false;
        }
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    watch: {
      '$route': 'getParams'
    },
    methods: {
      query() {
        axios.get('/api/account/getAccount').then((res) => {
          if (res.status == 200) {
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].userName == store.state.userName) {
                for (let j = 0; j < res.data[i].shops.length; j++) {
                  if (res.data[i].shops[j].name == this.shopName) {
                    this.shopDetails = res.data[i].shops[j]
                    this.imgUrl = this.shopDetails.imgUrl
                    let arr = [res.data[i].shops[j]][0].dishes
                    for (let k = 0; k < arr.length; k++) {
                      for (let l = 0; l < arr[k].foods.length; l++) {
                        if (arr[k].foods[l].count > 0) {
                          arr[k].foods[l].imgUrl = common.getImgUrl(arr[k].foods[l].imgUrl)
                          this.goodsArr.push(arr[k].foods[l])
                        }
                      }
                    }
                    this.distributionFee = res.data[i].shops[j].distributionFee
                    this.totalDistributionFee = 4 - this.distributionFee
                    document.documentElement.scrollTop = 0
                    let number = 0
                    this.goodsArr.forEach(item => {
                      number += item.count
                    })
                    this.packingCharges = (number * 0.4).toFixed(1)
                    let total = 0
                    for (let i = 0; i < this.goodsArr.length; i++) {
                      total += this.goodsArr[i].price * this.goodsArr[i].count
                    }
                    this.total = (Number(total) + Number(this.packingCharges) + Number(this.totalDistributionFee)).toFixed(1)
                    this.preferential = this.distributionFee
                  }
                }
              }
            }
          }
        }).catch(err => console.log(err));
      },
      getAllAddress() {
        axios.get('/api/account/getAccount').then((res) => {
          // 响应成功回调
          console.log(res)
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].userName == store.state.userName) {
              this.addressArr = res.data[i].address
            }
          }
        })
      },
      getArrivalTime() {
        let newDate = new Date().getTime() + 1800000;
        let date = new Date(newDate)
        let hour = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();//得到小时
        let min = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();//得到分钟
        this.arrivalTime = '大约' + hour + ':' + min + '送达'
        let week = new Date().getDay()
        let weeks = week
        week == 1 ? week = '周一' : week == 2 ? week = '周二' : week == 3 ? week = '周三' : week == 4 ? week = '周四' : week == 5 ? week = '周五' : week == 6 ? week = '周六' : week = '周天'
        weeks == 1 ? weeks = '周二' : weeks == 2 ? weeks = '周三' : weeks == 3 ? weeks = '周四' : weeks == 4 ? weeks = '周五' : weeks == 5 ? weeks = '周六' : weeks == 6 ? weeks = '周天' : weeks = '周一'
        this.today = '今天（' + week + '）'
        this.tomorrow = '明天（' + weeks + '）'
        if (hour < 21) {
          this.todayTimeArr.push({hour: '立即送出 ' + hour, min: min, price: 4, show: true})
        } else {
          this.todayTimeArr.push({hour: '立即送出 ' + hour, min: min, price: 5, show: true})
        }
        if (min < 20) {
          if (hour < 21) {
            this.todayTimeArr.push({hour: hour, min: '30', price: 4, show: false})
          } else {
            this.todayTimeArr.push({hour: hour, min: '30', price: 5, show: false})
          }
        }
        // 今天的送餐时间
        for (let j = hour + 1; j <= 23; j++) {
          if (j < 21) {
            this.todayTimeArr.push({hour: j, min: '00', price: 4, show: false})
            this.todayTimeArr.push({hour: j, min: '30', price: 4, show: false})
          } else {
            this.todayTimeArr.push({hour: j, min: '00', price: 5, show: false})
            this.todayTimeArr.push({hour: j, min: '30', price: 5, show: false})
          }
        }
        // 明天的送餐时间
        for (let i = 10; i <= 23; i++) {
          if (i < 21) {
            this.tomorrowTimeArr.push({hour: i, min: '00', price: 4, show: false})
            this.tomorrowTimeArr.push({hour: i, min: '30', price: 4, show: false})
          } else {
            this.tomorrowTimeArr.push({hour: i, min: '00', price: 5, show: false})
            this.tomorrowTimeArr.push({hour: i, min: '30', price: 5, show: false})
          }
        }
      },
      handleScroll() {
        if (document.documentElement.scrollTop > 0) {
          if (this.address.userName == '' || this.address.userName == null) {
            this.orderTitle = '选择收货地址'
            this.scrollShow = true
          } else {
            this.orderTitle = this.address.addressName + '  ' + this.address.doorNumber
          }
          this.$refs.orderTitleBg.$el.style.backgroundColor = '#409EFF'
          this.$refs.orderTitleBg.$el.style.cursor = 'pointer'
        } else {
          this.orderTitle = '提交订单';
          this.$refs.orderTitleBg.$el.style.backgroundColor = ''
          this.$refs.orderTitleBg.$el.style.cursor = 'auto'
          this.scrollShow = false
        }
      },
      getTitleAddress() {
        if (document.documentElement.scrollTop > 0) {
          this.addressDrawer = true
        }
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.shopName
        // 将数据放在当前组件的数据内
        this.shopName = routerParams
      },
      // 修改地址
      editAddress(index) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this.addressForm = Object.assign({}, this.addressArr[index])
        if (this.addressForm.gender == '先生') {
          this.genderOne = 'primary'
        } else if (this.addressForm.gender == '女士') {
          this.genderTwo = 'primary'
        }
        this.editAddressDialog = true
      },
      confirmAddress(index) {
        this.address = this.addressArr[index]
        if (document.documentElement.scrollTop > 0) {
          this.orderTitle = this.address.addressName + '  ' + this.address.doorNumber
        }
        this.chooseAddress = false
        this.addressDrawer = false
        this.scrollShow = false
      },
      getAddress() {
        this.getLocation()
        console.log(this.locationData);
        console.log(this.addressForm.addressName);
        this.addressForm.addressName = this.locationData.Address
        console.log(this.addressForm.addressName);
      },
      getLocation() {
        let self = this;
        AMap.plugin("AMap.Geolocation", function () {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          });

          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", onComplete);
          AMap.event.addListener(geolocation, "error", onError);

          function onComplete(data) {
            // data是具体的定位信息
            // debugger
            console.log("定位成功信息：", data);
            self.newGetAddress(data.position.lat, data.position.lng);
          }

          function onError(data) {
            // debugger
            // 定位出错
            console.log("定位失败错误：", data);
            self.getLngLatLocation();
          }
        });
      },
      getLngLatLocation() {
        let self = this;
        AMap.plugin("AMap.CitySearch", function () {
          let citySearch = new AMap.CitySearch();
          citySearch.getLocalCity(function (status, result) {
            if (status === "complete" && result.info === "OK") {
              // 查询成功，result即为当前所在城市信息
              console.log("通过ip获取当前城市：", result);
              //逆向地理编码
              AMap.plugin("AMap.Geocoder", function () {
                let geocoder = new AMap.Geocoder({
                  // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                  city: result.adcode
                });
                console.log('result' + JSON.stringify(result));
                console.log('result.adcode' + result.adcode);

                let lnglat = result.rectangle.split(";")[0].split(",");

                geocoder.getAddress(lnglat, function (status, data) {
                  if (status === "complete" && data.info === "OK") {
                    // result为对应的地理位置详细信息
                    console.log(data);
                    // self.userInfo.ProvinceName = data.regeocode.addressComponent.province.toString();
                    // self.userInfo.CCityName = data.regeocode.addressComponent.city;
                    // self.userInfo.RegionName = data.regeocode.addressComponent.district;
                  }
                });
              });
            }
          });
        });
      },
      newGetAddress: function (latitude, longitude) {
        let _thisSelf = this;
        _thisSelf.locationData.lat = latitude;
        _thisSelf.locationData.lon = longitude;
        let mapObj = new AMap.Map("mapAmap1");
        mapObj.plugin("AMap.Geocoder", function () {
          let geocoder = new AMap.Geocoder({
            city: "全国", // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            radius: 100 // 以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
          });
          let lnglat = [longitude, latitude]; // 倒序反写经纬度
          // 天津120 北京110 上海310 重庆500 ,
          let reg1 = /^[1][1][0][0-9][0-9][0-9]/;
          let reg2 = /^[1][2][0][0-9][0-9][0-9]/;
          let reg3 = /^[5][0][0][0-9][0-9][0-9]/;
          let reg4 = /^[3][1][0][0-9][0-9][0-9]/;
          geocoder.getAddress(lnglat, function (status, result) {
            console.log(result);
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              let adcode = result.regeocode.addressComponent.adcode; // 省市编码
              if (
                reg1.test(adcode) ||
                reg2.test(adcode) ||
                reg3.test(adcode) ||
                reg4.test(adcode)
              ) {
                _thisSelf.locationData.city =
                  result.regeocode.addressComponent.province;
              } else {
                _thisSelf.locationData.city =
                  result.regeocode.addressComponent.city;
              }
              // 提取 省 市 区 详细地址信息 重拼装省-市-区信息
              _thisSelf.locationData.province = result.regeocode.addressComponent.province;
              _thisSelf.locationData.district = result.regeocode.addressComponent.district;
              _thisSelf.locationData.Address = result.regeocode.formattedAddress;
              _thisSelf.locationData.nowPlace = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district;
              // _thisSelf.userInfo.ProvinceName = _thisSelf.locationData.province;
              // _thisSelf.userInfo.CCityName = _thisSelf.locationData.city;
              // _thisSelf.userInfo.RegionName = _thisSelf.locationData.district;
            } else {
              console.log(_thisSelf.locationData); // 回调函数
            }
          });
        });
      },
      // 关闭地址弹窗
      addressDialogClosed() {
        // 数据清空
        this.addressForm = {}
        this.genderOne = ''
        this.genderTwo = ''
        this.$refs.addTagInfo.clearValidate();
      },
      chooseGender(e) {
        if (e.target.innerText == '先生') {
          this.genderOne = 'primary'
          this.genderTwo = ''
          this.addressForm.gender = '先生'
        } else if (e.target.innerText == '女士') {
          this.genderOne = ''
          this.genderTwo = 'primary'
          this.addressForm.gender = '女士'
        }
      },
      // 新增或修改保存地址
      goSaveAddress(formName) {
        if (this.addressForm.userName == '' || this.addressForm.userName == null) {
          this.$message.error('请填写姓名');
        } else if (this.addressForm.phone == '' || this.addressForm.phone == null) {
          this.$message.error('请填写手机号码');
        } else if (!common.isMobile(this.addressForm.phone)) {
          this.$message.error('请填写正确的手机号码');
        } else if (this.addressForm.addressName == '' || this.addressForm.addressName == null) {
          this.$message.error('请选择地址');
        } else {
          // 表单校验
          this.$refs[formName].validate(valid => {
            if (valid) {
              let parms = {
                userName: store.state.userName,
                address: this.addressForm
              }
              if (this.addAddressDialog == true) {
                // 添加端口
                axios.post("/api/address/createAddress", parms).then(res => {
                  if (res.status == 200) {
                    console.log(res);
                    this.$message({
                      type: "success",
                      message: "创建成功！"
                    });
                    this.getAllAddress()
                    this.addAddressDialog = false;
                  } else {
                    this.$message.error(res.data.message);
                  }
                }).catch(err => console.log(err));
              } else if (this.editAddressDialog == true) {
                // 编辑信息
                axios.put("/api/address/changeAddress", parms).then(res => {
                  if (res.status == 200) {
                    this.$message({
                      type: "success",
                      message: "修改成功！"
                    });
                    this.getAllAddress()
                    this.editAddressDialog = false;
                  } else {
                    this.$message.error(res.data.message);
                  }
                }).catch(err => console.log(err));
              }
            } else {
              this.$message.error("请输入正确的信息");
            }
          });
        }
      },
      // 送餐时间
      todayTabClick(index) {
        console.log(index);
        for (let i = 0; i < this.todayTimeArr.length; i++) {
          this.todayTimeArr[i].show = false
        }
        for (let j = 0; j < this.tomorrowTimeArr.length; j++) {
          this.tomorrowTimeArr[j].show = false
        }
        this.todayTimeArr[index].show = true
        if (index == 0) {
          this.sendTime = '立即送出'
        } else {
          this.sendTime = '指定时间'
        }
        this.distributionFee = this.todayTimeArr[index].price
        this.arrivalTime = this.todayTimeArr[index].hour + ':' + this.todayTimeArr[index].min
        this.sendTimeDialog = false
      },
      tomorrowTabClick(index) {
        for (let i = 0; i < this.todayTimeArr.length; i++) {
          this.todayTimeArr[i].show = false
        }
        for (let j = 0; j < this.tomorrowTimeArr.length; j++) {
          this.tomorrowTimeArr[j].show = false
        }
        this.tomorrowTimeArr[index].show = true
        this.distributionFee = this.tomorrowTimeArr[index].price
        this.sendTime = '指定时间'
        this.arrivalTime = this.tomorrow + this.tomorrowTimeArr[index].hour + ':' + this.tomorrowTimeArr[index].min
        this.sendTimeDialog = false
      },
      // 添加备注
      descInput() {
        if (this.orderTextarea.length >= 50) {
          this.$message.error('上限五十字噢');
        }
      },
      getTextarea(value) {
        if ((this.orderTextarea + '，' + value).length > 50) {
          this.$message.error('上限五十字噢');
        } else {
          if (this.orderTextarea == '' || this.orderTextarea == null) {
            this.orderTextarea = value
          } else {
            this.orderTextarea += '，' + value
          }
        }
      },
      submitOrderTextarea() {
        this.orderComments = this.orderTextarea
        this.orderCommentsDialog = false
      },
      // 选择餐具
      handleCommand(command) {
        this.dinnerware = command + '餐具'
        this.$refs.dinnerwareDropdown.style.color = '#000'
      },
      // 确认支付
      confirmPay() {
        if (this.address.addressName == '' || this.address.addressName == null) {
          this.$message.error('请选择地址');
        } else {
          let date = common.getTime()
          let totalLength = 0
          let goodsArr = []
          for (let i = 0; i < this.goodsArr.length; i++) {
            totalLength += this.goodsArr[i].count
            goodsArr.push({
              imgUrl: this.goodsArr[i].imgUrl,
              name: this.goodsArr[i].name,
              price: this.goodsArr[i].price,
              count: this.goodsArr[i].count,
            })
          }
          let req = {
            userName: store.state.userName,
            order: {
              imgUrl: this.imgUrl,
              shopName: this.shopName,
              goodsArr: goodsArr,
              packingCharges: this.packingCharges,
              distributionFee: this.distributionFee,
              totalDistributionFee: this.totalDistributionFee,
              total: this.total,
              sendTime: this.sendTime,
              address: this.address,
              date: date,
              orderComments: this.orderComments,
              totalLength: totalLength,
              dinnerware: this.dinnerware.substring(0,1),
            }
          }
          if (this.dinnerware == '未选择' || this.dinnerware == '无需餐具') {
            req.order.dinnerware = ''
          } else if (this.dinnerware == '10份餐具' || this.dinnerware == '10份以上餐具') {
            req.order.dinnerware = 10
          }
          const h = this.$createElement;
          this.$msgbox({
            title: '支付中心',
            message: h('p', null, [
              h('span', {}, '是否支付？ '),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '支付中...';
                setTimeout(() => {
                  done();
                  setTimeout(() => {
                    instance.confirmButtonLoading = false;
                  }, 300);
                }, 3000);
              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'success',
              message: '支付成功'
            });
            axios.post('/api/order/createOrder',req).then((res) => {
              // 响应成功回调
              console.log(res)
            })
            this.shopDetails.sell += 1
            for (let i = 0; i < this.shopDetails.dishes.length; i++) {
              for (let j = 0; j < this.shopDetails.dishes[i].foods.length; j++) {
                if (this.shopDetails.dishes[i].foods[j].count > 0) {
                  this.shopDetails.dishes[i].foods[j].sell += 1
                  this.shopDetails.dishes[i].foods[j].count = 0
                }
                this.shopDetails.dishes[i].foods[j].imgUrl = this.shopDetails.dishes[i].foods[j].imgUrl.replace('../../../static/firstPage','')
              }
            }
            let parms = {
              userName: store.state.userName,
              shops: this.shopDetails
            }
            axios.put('/api/shops/changeShops', parms).then((res) => {
              console.log(res);
            }).catch(err => console.log(err));
            axios.put('/api/shops/putShops', this.shopDetails).then((res) => {
              console.log(res);
            }).catch(err => console.log(err));
            this.$router.push({
              path: '/firstPage'
            })
          });
        }
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
</script>

<style scoped>
  >>> .el-drawer__header {
    color: #000;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 3px;
    margin-bottom: 0;
  }

  >>> .el-drawer__header > :first-child:focus {
    outline: none;
  }

  >>> .el-drawer__close-btn:focus {
    outline: none;
  }

  >>> .el-drawer__open .el-drawer.btt {
    height: 40% !important;
    overflow-y: scroll;
  }

  >>> .el-drawer.btt:focus {
    outline: none;
  }

  .el-form-item {
    margin: 5px;
  }

  >>> .addressDialog .el-dialog__header {
    text-align: center;
  }

  >>> .addressDialog .el-dialog__title {
    font-size: 25px;
    letter-spacing: 3px;
    font-weight: bold;
  }

  >>> .addressDialog .el-dialog__close {
    font-size: 25px;
  }

  >>> .addressDialog .el-dialog__body {
    padding-top: 10px;
  }

  >>> .addressDialog .el-form-item__label {
    font-size: 20px;
    color: #000;
    font-weight: bold;
  }

  >>> .addressDialog .el-input__inner {
    border: none;
    font-size: 20px;
    color: #000;
  }

  >>> .addressDialog .el-divider--horizontal {
    margin: 10px 0;
  }

  >>> .addressDialog .addressButton {
    width: 100% !important;
    height: 50px;
    font-size: 20px;
  }

  .genderChoose {
    color: #409EFF;
    border-color: #409EFF
  }

  >>> .sendTimeDialog .el-dialog__title {
    font-size: 25px;
  }

  >>> .sendTimeDialog .el-dialog__headerbtn {
    font-size: 25px;
  }

  .shopsLogo {
    display: inline-block;
    margin-left: auto;
    margin-top: -5px;
    padding: 6px;
    background-color: #409EFF;
    border-radius: 18px 0 18px 0;
    color: #fff;
    font-size: 15px;
  }

  .checkOrder {
    margin-left: auto;
    background-color: #00FF00;
    height: 100%;
    width: 20%;
    border: none;
    border-radius: 0;
    color: #fff;
    font-size: 20px;
  }

  .textareaButton .el-button + .el-button {
    margin-top: 10px;
  }
</style>
