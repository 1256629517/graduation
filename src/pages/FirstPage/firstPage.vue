<template>
  <el-container style="margin-top: 60px;">
    <el-header class="container-header" style="">
      <span class="header-search-input">
        <i class="el-icon-search" style="margin-left: 10px;cursor: pointer;" @click="goSearch()"></i>
        <el-input
          placeholder="请输入内容"
          v-model="input"
          clearable
          @clear="goSearch()">
        </el-input>
      </span>
      <el-button icon="el-icon-location" @click="getMyLocation()">{{city}}</el-button>
    </el-header>
    <el-main style="">
      <el-container>
        <el-header style="height: 150px;width: 36%;margin-left: 30%;">
          <el-carousel :interval="4000" type="card" height="150px">
            <el-carousel-item v-for="item in imgArr" :key="item">
              <img class="carousel-img" :src="item" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-header>
        <!--<div class="space"></div>-->
        <el-main style="padding: 20px 0;margin-top: 10px;">
          <el-container>
            <el-header class="main-header">
              <el-button style="margin-left: 5%;" v-for="item in buttonImage1" :key="item"
                         :style="{backgroundImage:'url('+item+')',backgroundSize:'100% 100%',borderRadius: '50%'}"  @click="goItem1('美食')">

              </el-button>
              <div style="line-height: 80px;margin-left: auto;color:#409EFF;font-size: 60px;font-weight: bold;font-style: italic;border: 3px solid #409EFF;border-radius: 5px;padding: 0 60px 0 56px;">吃了没</div>
              <el-button style="margin-right: 5%;" v-for="(item,index) in buttonImage2" :key="item"
                         :style="{backgroundImage:'url('+item+')',backgroundSize:'100% 100%',borderRadius: '50%',marginLeft:index==0?'auto':''}" @click="goItem2('饮料')">
              </el-button>
            </el-header>
            <!--<div class="space" style="padding-right: 20px"></div>-->
            <el-main style="padding: 10px;">
              <i class="iconfont iconRectangleCopy" style="color:#7B7B7B;margin-right: 5px;"></i>
              <span style="color:#7B7B7B;">附近商家</span>
              <shops ref="child"></shops>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
  import axios from 'axios'
  import shops from "../../components/shops"
  import store from '../../vuex'
  import mutations from '../../vuex/mutations'
  // import * as AMap from "mongoose";
  // import AMap from "AMap"; // 引入高德地图

  export default {
    name: "firstPage",
    components: {
      shops,
    },
    data() {
      return {
        input: '',
        city: '',
        imgArr: [
          require("../../assets/img/firstPage/mc.png"),
          require("../../assets/img/firstPage/hg.png"),
          require("../../assets/img/firstPage/cc.png"),
          require("../../assets/img/firstPage/nc.png"),
        ],
        buttonImage1: [
          require("../../assets/img/firstPage/mc.png"),
        ],
        buttonImage2: [
          require("../../assets/img/firstPage/nc.png"),
        ],
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
      }
    },
    created() {
      this.getLocation();
      this.query()

    },
    methods: {
      // 查询
      query() {
        axios.get('/api/shops/getShops').then((res) => {
          // 响应成功回调
          console.log(res)
        })
        if (store.state.city == "") {
          this.city = '获取城市'
        } else {
          this.city = store.state.city
        }
      },
      goSearch() {
        this.$refs.child.query(this.input,'');
      },
      goItem1(data) {
        this.$refs.child.query(this.input,data);
      },
      goItem2(data) {
        this.$refs.child.query(this.input,data);
      },
      // 获取定位
      getMyLocation() {
        this.getLocation();
        this.city = this.locationData.city
        mutations.updateCity(store.state, this.city)
      },
      getLocation() {
        let self = this;
        AMap.plugin("AMap.Geolocation", function() {
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
        AMap.plugin("AMap.CitySearch", function() {
          let citySearch = new AMap.CitySearch();
          citySearch.getLocalCity(function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // 查询成功，result即为当前所在城市信息
              console.log("通过ip获取当前城市：", result);
              //逆向地理编码
              AMap.plugin("AMap.Geocoder", function() {
                let geocoder = new AMap.Geocoder({
                  // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                  city: result.adcode
                });
                console.log('result'+JSON.stringify(result));
                console.log('result.adcode'+result.adcode);

                let lnglat = result.rectangle.split(";")[0].split(",");

                geocoder.getAddress(lnglat, function(status, data) {
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
      newGetAddress: function(latitude, longitude) {
        let _thisSelf = this;
        _thisSelf.locationData.lat = latitude;
        _thisSelf.locationData.lon = longitude;
        let mapObj = new AMap.Map("mapAmap1");
        mapObj.plugin("AMap.Geocoder", function() {
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
          geocoder.getAddress(lnglat, function(status, result) {
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
      }
    }
  }
</script>

<style scoped>
  .container .container-header {
    display: flex;
    align-items: center;
    font-size: 20px;
    background-color: #409EFF;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }

  .container-header .header-search-input {
    display: inline-block;
    background-color: #fff;
    width: 45%;
    border: 1px solid #DCDFE6;
    border-radius: 10px;
  }

  .container-header .el-input {
    width: 88%;
    font-size: 18px;
  }

  >>> .container-header .el-input--suffix .el-input__inner {
    border: none;
    padding: 0 30px 0 0;
  }


  .container-header .el-button {
    margin-left: auto;
    background-color: transparent;
    border: none;
    font-size: 20px;
    color: #fff;
    opacity: 0.9;
  }

  .container-header .el-button:focus, .el-button:hover {
    color: #fff;
    opacity: 1;
  }

  .carousel-item {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
  }

  .carousel-img {
    /*max-width: 100%;*/
    max-height: 100%;
  }

  .space {
    width: 100%;
    height: 10px;
    background-color: #DCDFE6;
    position: relative;
    margin-top: 20px;
    left: -20px;
    padding-right: 40px;
    opacity: 0.2;
  }

  .main-header {
    display: flex;
    height: 120px !important;
    padding: 10px;
    -moz-box-shadow: 0 0 5px #888888;
    box-shadow: 0 0 5px #888888;
    text-align: center;
  }

  .main-header .el-button {
    margin-right: 20px;
    height: 100px;
    width: 100px;
  }

  .main-header .el-button:focus, .el-button:hover {
    opacity: 0.7;
  }
</style>
