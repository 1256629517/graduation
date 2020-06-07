const models = require('./db');
const express = require('express');
const router = express.Router();

// 账号
// 获取已有账号接口
router.get('/api/account/getAccount', (req, res) => {
  // 通过模型去查找数据库
  models.account.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
// 注册账号接口
router.post('/api/account/createAccount', (req, res) => {
  // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
  let newAccount = new models.account({
    userName: req.body.userName,
    password: req.body.password,
    selectValue: req.body.selectValue,
    answer: req.body.answer,
    shops: req.body.shops,
  });
  // 保存数据newAccount数据进MongoDB
  newAccount.save((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send('注册成功');
    }
  });
});
// 修改用户名接口
router.put('/api/account/changeAccountName', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName},
    {$set: {
        userName: req.body.newAccount,
      }
    }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
// 修改头像接口
router.put('/api/account/changeAccountImg', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName},
    {$set: {
        imgUrl: req.body.imgUrl,
      }
    }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
// 修改密码接口
router.put('/api/account/changeAccountPwd', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName},
    {$set: {
        password: req.body.password,
      }
    }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
// 修改商品详情接口
router.put('/api/shops/changeShops', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName,"shops.name": req.body.shops.name},
    {$set: {
        "shops.$.collect": req.body.shops.collect,
        "shops.$.dishes": req.body.shops.dishes,
        "shops.$.sell": req.body.shops.sell,
      }
    }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
});
// 新增订单详情接口
router.post('/api/order/createOrder', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName},
    {$push: {
        order: {
          imgUrl: req.body.order.imgUrl,
          shopName: req.body.order.shopName,
          goodsArr: req.body.order.goodsArr,
          packingCharges: req.body.order.packingCharges,
          distributionFee: req.body.order.distributionFee,
          totalDistributionFee: req.body.order.totalDistributionFee,
          total: req.body.order.total,
          sendTime: req.body.order.sendTime,
          address: req.body.order.address,
          date: req.body.order.date,
          totalLength: req.body.order.totalLength,
          orderComments: req.body.order.orderComments,
          dinnerware: req.body.order.dinnerware
        }
      }
    },(err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send('注册成功');
      }
    });
});
// 新增地址接口
router.post('/api/address/createAddress', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName},
    {$push: {
        address: {
          addressName: req.body.address.addressName,
          doorNumber: req.body.address.doorNumber,
          userName: req.body.address.userName,
          gender: req.body.address.gender,
          phone: req.body.address.phone,
        }
      }
    },(err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send('新增成功');
      }
    });
});
// 修改地址接口
router.put('/api/address/changeAddress', (req, res) => {
  models.account.updateOne(
    {userName: req.body.userName,"address._id": req.body.address._id},
    {$set: {
        "address.$.addressName": req.body.address.addressName,
        "address.$.doorNumber": req.body.address.doorNumber,
        "address.$.userName": req.body.address.userName,
        "address.$.gender": req.body.address.gender,
        "address.$.phone": req.body.address.phone,
      }
    }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
});
// 删除地址接口
router.put('/api/address/deleteAddress', (req, res) => {
  console.log(req.body);
  models.account.updateOne(
    {userName: req.body.userName,},
    {$pull: {
        address: {
          _id: req.body.reqId,
        }
      }
    },(err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send('删除成功');
    }
  });
});

// 商家
// 获取已有商家接口
router.get('/api/shops/getShops', (req, res) => {
  // 通过模型去查找数据库
  models.shops.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
// 修改商家信息接口
router.put('/api/shops/putShops', (req, res) => {
  // 通过模型去查找数据库
  models.shops.updateMany(
    {name: req.body.name},
    {$set: {
        sell: req.body.sell,
        dishes: req.body.dishes,
      }
    } , (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send('修改成功');
      }
    });
});

module.exports = router;
