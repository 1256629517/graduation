export default {
  count,
  getLocation,
  getLngLatLocation,
  newGetAddress,
  isMobile,
  getTime,
  getImgUrl,
}

function getImgUrl(imgUrl) {
  if (imgUrl.indexOf('../../../static/firstPage') != -1) {
    return imgUrl
  } else {
    return '../../../static/firstPage' + imgUrl
  }
}

function getLocation() {
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
}

function getLngLatLocation() {
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
}

function newGetAddress(latitude, longitude) {
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

function count(o){
  let t = typeof o;
  if(t == 'string'){
    return o.length;
  }else if(t == 'object'){
    let n = 0;
    for(let i in o){
      n++;
    }
    return n;
  }
  return false;
}

function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

function getTime() {
  let myDate = new Date();
  let year = myDate.getFullYear()
  let month = myDate.getMonth()+1
  let day = myDate.getDate()
  let hour = myDate.getHours()
  let min = myDate.getMinutes()>10?myDate.getMinutes():'0'+myDate.getMinutes()
  let sec = myDate.getSeconds()>10?myDate.getSeconds():'0'+myDate.getSeconds()
  return year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec
}
