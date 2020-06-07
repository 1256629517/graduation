let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/graduation',{useMongoClient: true})

let Schema = mongoose.Schema

// 数据库连接成功的事件
mongoose.connection.once("open",function(){
  console.log("数据库连接成功~~")
})

// 数据库断开的事件
mongoose.connection.once("close",function(){
  console.log("数据库连接已经断开~~")
})

// 登录
let accountSchema = new Schema({
  userName: String,
  password: String,
  selectValue: Number,
  answer: String,
  imgUrl: String,
  address: [{
    addressName: String,
    doorNumber: String,
    userName: String,
    gender: String,
    phone: String,
  }],
  shops: [{
    imgUrl: String,  // 图片
    name: String,  // 店铺名字
    address: String,  // 店铺地址
    sell: Number,  // 店铺销量
    distributionFee: Number,  // 配送费
    collect: Number,  // 是否收藏
    shopType: String,  // 店铺类型
    phone: String,  // 联系电话
    businessHours: String,  // 营业时间
    time: String,  // 配送时间
    dishes: [{
      dishType: String,  // 菜单名字
      foods: [{
        imgUrl: String,  // 图片
        name: String,  // 菜品名字
        sell: Number,  // 月售
        price: Number,  // 价格
        count: Number,  // 数量
       }]
    }],  // 菜品
  }],
  order: [{
    imgUrl: String,
    shopName: String,
    goodsArr: [{
      imgUrl: String,
      name: String,
      count: String,
      price: String,
    }],
    packingCharges: Number,
    distributionFee: Number,
    totalDistributionFee: Number,
    total: Number,
    sendTime: String,
    address: {
      addressName: String,
      doorNumber: String,
      userName: String,
      gender: String,
      phone: String,
    },
    date: String,
    totalLength: Number,
    orderComments: String,
    dinnerware: String,
  }]
})

// 商品详情
let shopsSchema = new Schema({
  imgUrl: String,  // 图片
  name: String,  // 店铺名字
  address: String,  // 店铺地址
  sell: Number,  // 店铺销量
  distributionFee: Number,  // 配送费
  collect: Number,  // 是否收藏
  shopType: String,  // 店铺类型
  phone: String,  // 联系电话
  businessHours: String,  // 营业时间
  time: String,  // 配送时间
  dishes: [{
    dishType: String,  // 菜单名字
    foods: [{
      imgUrl: String,  // 图片
      name: String,  // 菜品名字
      sell: Number,  // 月售
      price: Number,  // 价格
      count: Number,  // 数量
    }]
  }],  // 菜品
})

const Models = {
  account : mongoose.model('account',accountSchema),
  shops : mongoose.model('shops',shopsSchema),
}

module.exports = Models;

