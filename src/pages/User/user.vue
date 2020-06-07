<template>
  <div>
    <el-container style="height: calc(100vh - 60px);background-color: #F0F0F0;">
      <el-header class="header">
        <div class="header-title">个人用户中心</div>
        <el-container style="padding: 10px;cursor:pointer;">
          <el-aside width="200px">
            <div v-show="!afterLogin" class="header-uploader"></div>
            <el-upload
              v-show="afterLogin"
              class="avatar-uploader header-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-aside>
          <el-main style="font-size: 25px;color: #fff;display: flex;">
            <div style="margin-top: 24px;font-size: 40px;">{{userText}}</div>
            <span v-show="afterLogin" style="margin-left: auto;" @click="backLogin()">
              <span>退出登录</span>
              <i class="el-icon-arrow-right" style="margin-top: 40px;"></i>
            </span>
          </el-main>
        </el-container>
      </el-header>
      <el-main style="padding: 0;">
        <div v-for="(item,index) in chooseArr" :key="index" class="footer"
             :style="{borderTop:item.borderTop,marginTop: item.marginTop}" @click="getMyChoose(index)">
        <span>
          <i :class="item.icon" style="color: #409EFF;margin-right: 5px;"></i>{{item.name}}
        </span>
          <span style="margin-left: auto;margin-right: 20px;">
          <i class="el-icon-arrow-right" style=""></i>
        </span>
        </div>
      </el-main>
    </el-container>

    <!-- 个人信息管理 -->
    <el-dialog
      center
      title="我的信息"
      :visible.sync="myInfoDialog"
      width="50%"
      style="font-weight: bold;">
      <div style="">
        <div style="height: 100px;display: flex;cursor:pointer;" @click="">
          <span>头像</span>
          <span style="margin-left: auto;" class="myInfoDialog">
            <div v-show="!afterLogin" class="dialog-uploader"></div>
            <el-upload
              v-show="afterLogin"
              class="avatar-uploader dialog-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" style="width: 100px;height: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </span>
          <i style="margin-top: 4px;margin-left: 5px;" class="el-icon-arrow-right"></i>
        </div>
        <div style="height: 30px;display: flex;cursor:pointer;margin-top: 10px;" @click="myNewInfoDialog=true;newUserName=''">
          <span>用户名</span>
          <span style="margin-left: auto;">{{userName}}</span>
          <i style="margin-top: 4px;margin-left: 5px;" class="el-icon-arrow-right"></i>
        </div>
      </div>
    </el-dialog>

    <!-- 修改信息 -->
    <el-dialog
      center
      title="修改用户名"
      :visible.sync="myNewInfoDialog"
      width="50%"
      style="font-weight: bold;">
      <el-input @keyup.native="userKeyUp" placeholder="请输入新的用户名" v-model="newUserName" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="myNewInfoDialog = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="changeName()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 地址管理 -->
    <el-dialog
      center
      title="我的地址"
      :visible.sync="myAddressDialog"
      width="50%"
      style="font-weight: bold;">
      <div style="">
        <div style="margin-bottom: 20px;">
          <div v-for="(item,index) in addressArr" :key="index"
               style="display: flex;margin: 10px 20px;padding-bottom:10px;cursor:pointer;border-bottom: 1px solid rgb(230,230,230)">
          <span>
            <div style="font-weight: bold;">{{item.addressName}}&nbsp&nbsp{{item.doorNumber}}</div>
            <div>{{item.userName}}
              <span v-show="item.gender&&item.gender!=''">（</span>{{item.gender}}
              <span v-show="item.gender&&item.gender!=''">）</span>&nbsp&nbsp{{item.phone}}
            </div>
          </span>
            <span style="margin-left: auto;margin-top: 1%;width: 20%;">
            <el-button :title="'编辑'" @click.native.prevent="editAddress(index)" type="primary" icon="el-icon-edit"
                       circle size="mini"></el-button>
            <el-button style="margin-left: 6px" :title="'删除'" @click.native.prevent="deleteAddress(index)" type="danger"
                       icon="el-icon-delete" circle size="mini"></el-button>
            </span>
          </div>
        </div>
        <el-button type="primary"
                   style="margin-left: 30%;width: 40%;"
                   @click="addAddressDialog=true" icon="el-icon-circle-plus-outline">新增收获地址
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      center
      class="addressDialog"
      @closed="addressDialogClosed()"
      :title="addAddressDialog?'新增地址':'编辑地址'"
      :visible.sync="addressDialog"
      width="50%"
      style="font-weight: bold;">
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

    <!-- 收藏管理 -->
    <el-dialog
      center
      title="我的收藏"
      :visible.sync="myCollectDialog"
      width="50%"
      style="font-weight: bold;">
      <div style="">
        <div style="text-align: center" v-show="collectArr.length==0">你还没有收藏的店铺哟~~~</div>
        <el-container v-for="(item,index) in collectArr" v-show="collectArr.length!=0" :key="index"
                      style="cursor:pointer;" @click.native="goDetails(item.name)">
          <el-aside width="200px" style="padding-top: 10px;overflow: hidden">
            <img :src="item.imgUrl" alt="" style="width: 200px;height: 90px;">
          </el-aside>
          <el-main class="main-shops" style="">
            <div style="font-weight: bold;">{{item.name}}</div>
            <div style="display: flex">
              <!--<i class="iconfont iconxingji" style="color:#FFD306;"></i>-->
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
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import common from '../../assets/js/common'
  import store from '../../vuex'
  import mutations from '../../vuex/mutations'

  export default {
    name: "user",
    data() {
      return {
        imageUrl: '',
        userText: '登录/注册',
        userName: '',
        afterLogin: false,
        chooseArr: [
          {
            name: '我的信息',
            icon: 'el-icon-s-custom',
            marginTop: '20px',
          },
          {
            name: '我的地址',
            icon: 'el-icon-location',
            borderTop: '1px solid rgba(136,136,136,0.3)',
          },
          {
            name: '我的收藏',
            icon: 'el-icon-star-on',
            borderTop: '1px solid rgba(136,136,136,0.3)',
          },
        ],
        myInfoDialog: false,
        myNewInfoDialog: false,
        newUserName: '',
        myAddressDialog: false,
        addAddressDialog: false,
        editAddressDialog: false,
        addressArr: [],
        genderOne: '',
        genderTwo: '',
        // 地址数据
        addressForm: {
          addressName: '',
          doorNumber: '',
          userName: '',
          gender: '',
          phone: '',
        },
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
        collectArr: [],
        myCollectDialog: false,
      }
    },
    created() {
      if (store.state.userName == '') {
        this.userText = '登录/注册'
        this.afterLogin = false
      } else {
        this.userText = store.state.userName
        this.userName = store.state.userName
        this.afterLogin = true
      }
      this.getLocation()
      this.query()
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
      },
    },
    methods: {
      query() {
        this.collectArr = []
        axios.get('/api/account/getAccount').then((res) => {
          // 响应成功回调
          if (res.status == 200) {
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].userName == store.state.userName) {
                this.imageUrl = res.data[i].imgUrl
                for (let j = 0; j < res.data[i].shops.length; j++) {
                  if (res.data[i].shops[j].collect == 1) {
                    res.data[i].shops[j].imgUrl = common.getImgUrl(res.data[i].shops[j].imgUrl)
                    this.collectArr.push(res.data[i].shops[j])
                  }
                }
              }
            }
          }
        })
      },
      backLogin() {
        this.$confirm('此操作将退出系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          mutations.updateName(store.state, '')
          mutations.updateCity(store.state, '')
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 用户名不能有空格
      userKeyUp() {
        this.newUserName = this.newUserName.replace(/[ ]/g,"");
      },
      changeName() {
        if (this.newUserName == "") {
          this.$message.error("用户名不能为空");
        } else {
          axios.get('/api/account/getAccount').then((res) => {
            // 响应成功回调
            console.log(res)
            let flag = true
            for (let i = 0; i < res.data.length; i++) {
              if (this.newUserName == res.data[i].userName) {
                flag = false
                this.$message.error("用户名已存在");
              }
            }
            if (flag) {
              let params = {
                userName: store.state.userName,
                newAccount: this.newUserName,
              }
              axios.put('/api/account/changeAccountName', params).then((res) => {
                if (res.status == 200) {
                  console.log(res);
                  mutations.updateName(store.state, this.newUserName)
                  this.userText = this.newUserName
                  this.userName = this.newUserName
                  this.myNewInfoDialog = false
                  setTimeout(() => {
                    this.$message({
                      type: "success",
                      message: "修改成功！"
                    });
                  }, 1000);
                }
              }).catch(err => console.log(err));
            }
          })
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(this.imageUrl);
        let params = {
          userName: store.state.userName,
          imgUrl: this.imageUrl,
        }
        axios.put('/api/account/changeAccountImg', params).then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
          } else {
            this.$message.error(res.data.message);
          }
        }).catch(err => console.log(err));
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
      getMyChoose(index) {
        if (index == 0) {
          this.myInfoDialog = true
        } else if (index == 1) {
          this.getAllAddress()
          this.myAddressDialog = true
        } else if (index == 2) {
          this.query()
          this.myCollectDialog = true
        }
      },
      // 修改地址
      editAddress(index) {
        this.addressForm = Object.assign({}, this.addressArr[index])
        if (this.addressForm.gender == '先生') {
          this.genderOne = 'primary'
        } else if (this.addressForm.gender == '女士') {
          this.genderTwo = 'primary'
        }
        this.editAddressDialog = true
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
      // 关闭地址弹窗
      addressDialogClosed() {
        // 数据清空
        this.addressForm = {}
        this.genderOne = ''
        this.genderTwo = ''
        this.$refs.addTagInfo.clearValidate();
      },
      // 删除地址
      deleteAddress(index) {
        let req = {
          userName: store.state.userName,
          reqId: this.addressArr[index]._id
        }
        this.$confirm("此操作将进行删除操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // 确认删除
          axios.put('/api/address/deleteAddress', req).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getAllAddress()
            } else {
              this.$message.error(res.data.message);
            }
          }).catch(err => console.log(err));
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
      // 新增或修改保存地址
      goSaveAddress(formName) {
        console.log(this.addressForm);
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
      getAddress() {
        this.getLocation()
        this.addressForm.addressName = this.locationData.Address
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
      goDetails(name) {
        this.$router.push({
          path: '/shopDetails',
          query: {
            shopName: name
          }
        })
      },
    }
  }
</script>

<style scoped>
  .header {
    height: 240px !important;
    background-color: #409EFF;
  }

  .header .header-title {
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    color: #fff;
    padding: 10px 0;
    border-bottom: 1px solid #fff;
    margin: 0 -20px;
  }

  .header .header-uploader {
    width: 150px;
    height: 150px;
    background-image: url("../../assets/img/user/userIcon.jpg");
    background-size: 100% 100%;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 20px;
  }

  .myInfoDialog .dialog-uploader {
    width: 100px;
    height: 100px;
    background-image: url("../../assets/img/user/userIcon.jpg");
    background-size: 100% 100%;
  }

  .el-icon-plus:before {
    content: none;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .footer {
    height: 40px;
    background-color: #fff;
    line-height: 40px;
    padding: 5px 20px;
    font-size: 20px;
    display: flex;
    cursor: pointer;
  }

  >>> .el-dialog--center .el-dialog__body {
    padding: 20px;
    font-size: 18px;
  }

  .el-form-item {
    margin: 5px;
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

  .main-shops {
    padding: 10px 0 10px 20px;
  }

  .main-shops div:not(:first-child) {
    margin-top: 5px;
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
    font-size: 25px;
  }
</style>
