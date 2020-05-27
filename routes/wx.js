var express = require('express');
var router = express.Router();
var mongo = require("./shujukufangfafengzhuang.js");
const request = require('request'); //http请求模块
const fs = require('fs'); //文件系统模块
const path = require('path'); //文件路径模块
const sha1 = require('node-sha1'); //加密模块
const urlencode = require('urlencode'); //URL编译模块
var parseString = require('xml2js').parseString;
var msg = require('../js/ismsg');
var config = require("../js/isWcConfig");
var accessTokenJson = require("../js/wcAccess_token");
var util = require("util");
var menu = require("../js/menu");
var crawler = require('../js/crawler');

/**
 * [开启跨域便于接口访问]
 */
// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
//   res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
//   res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next();
// });


/**
 * [设置验证微信接口配置参数]
 * 73c532b289d003e926d4a4648f127926 appSecret
 */
// let config = {
// 	token: config.token, //对应测试号接口配置信息里填的token
// 	appid: 'wxab206bb4cbe7857a', //对应测试号信息里的appID
// 	secret: '73c532b289d003e926d4a4648f127926', //对应测试号信息里的appsecret
// 	grant_type: 'client_credential' //默认
// };
//获取全局access_token
let getAccessToken = function () {
  let that = this;
  return new Promise(function (resolve, reject) {
    var currentTime = new Date().getTime();
    //格式化请求地址，把刚才的%s按顺序替换
    var url = util.format(config.diyApi.getAccessToken, config.prefix, config.appID, config.appScrect);
    console.log(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime)
    if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
      requestGet(url).then(function (data) {
        var result = JSON.parse(data);
        if (data.indexOf("errcode") < 0) {
          accessTokenJson.access_token = result.access_token;
          accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
          console.log('更新本地存储的' + result)
          console.log(JSON.stringify(accessTokenJson))
          //更新本地存储的
          fs.writeFile('/tenxunyun/web/node/js/wcAccess_token.json', JSON.stringify(accessTokenJson), function (err) {
            if (err) {
              console.log(err)
            }
          });
          resolve(accessTokenJson.access_token);
        } else {
          console.log('本地存储的')
          // resolve(result);
        }
      });
    } else {
      //将本地存储的 access_token 返回
      resolve(accessTokenJson.access_token);
    }
  })

};
router.get('/wxJsSdkConfig', function (req, res, next) {
  // console.log("这是前端传过来的url",req.query.url)
  // console.log('是token',accessTokenJson.access_token)
  var currentTime = new Date().getTime();
  if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
    getAccessToken().then(function (data) {
      var url = util.format(config.diyApi.createMenu, config.prefix, data);
      console.log(url)
      requestPost(url, JSON.stringify(menu)).then(function (data) {
        //将结果打印
        console.log(data);
      });
    })
  } else {
    var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=" + accessTokenJson.access_token;
    var params = {};
    params.url = req.query.url;
    requestGet(url).then(function (data) {
      var result = JSON.parse(data);
      params.ticket = result.ticket
      console.log(data)
      if (result) {
        crawler(params, res)
      }
      // console.log('ticket'.params.ticket)
      // crawler(params,res)
      // console.log(crawler.getSign())
    })
  }
})
router.get('/wxind', function (req, res, next) {
  var that = this;
  // console.log(req)
  // console.log(accessTokenJson)
  // 先判断accessTokenJson是否过期
  const token = config.token; //获取配置的token
  const signature = req.query.signature; //获取微信发送请求参数signature
  const nonce = req.query.nonce; //获取微信发送请求参数nonce
  const timestamp = req.query.timestamp; //获取微信发送请求参数timestamp
  const str = [token, timestamp, nonce].sort().join(''); //排序token、timestamp、nonce后转换为组合字符串
  const sha = sha1(str); //加密组合字符串
  //如果加密组合结果等于微信的请求参数signature，验证通过
  if (sha === signature) {
    const echostr = req.query.echostr; //获取微信请求参数echostr
    res.send(echostr + ''); //正常返回请求参数echostr
  } else {
    res.send('验证失败');
  }

})
router.post('/wxind', function (req, res, next) {
  getAccessToken().then(function (data) {
    var url = util.format(config.diyApi.createMenu, config.prefix, data);
    console.log(url)
    requestPost(url, JSON.stringify(menu)).then(function (data) {
      //将结果打印
      console.log(data);
    });
  })
  var buffer = [],
    that = this;
  req.on('data', function (data) {
    buffer.push(data);
  });
  req.on('end', function () {
    var msgXml = Buffer.concat(buffer).toString('utf-8');
    console.log(msgXml)
    parseString(msgXml, { explicitArray: false }, function (err, result) {
      // 如果有错误直接抛出
      if (err) throw err;
      result = result.xml;

      var toUser = result.ToUserName;
      var fromUser = result.FromUserName;
      var resultXml = "";
      // console.log(result)
      console.log(result.MsgType)
      // 判断消息类型
      if (result.MsgType === "event") {
        console.log(result.Event)
        // 关注微信公众号
        if (result.Event === "subscribe") {
          resultXml = msg.textMsg(fromUser, toUser, "欢迎关注，哈哈哈哈！");
          res.send(resultXml);
        } else if (result.Event === "CLICK") {
          console.log(result.EventKey)
          resultXml = msg.EventReply(fromUser, toUser, result.EventKey);
          // console.log(resultXml);
          res.send(resultXml);
        } else if (result.Event === "view") {
          // resultXml = msg.textMsg(fromUser, toUser, "欢迎关注，哈哈哈哈！");
          // res.send(resultXml);
        }
      } else {
        if (result.MsgType === "text") {
          console.log(result.Content)
          if (result.Content == '1') {
            resultXml = msg.textMsg(fromUser, toUser, "你好呀，我们又见面了！");
            res.send(resultXml);
            return;
          } else {
            resultXml = msg.textMsg(fromUser, toUser, "你是不是猪别");
            res.send(resultXml);
            return;
          }
        }
      }
    })
  })
});
/**
 * 封装请求post
 */
let requestPost = function (url, data) {
  return new Promise(function (resolve, reject) {
    request.post({ url: url, formData: data }, function (err, httpResponse, body) {
      resolve(body);
    })
  })
};
/**
 * 封装请求get
 */
let requestGet = function (url) {
  return new Promise(function (resolve, reject) {
    request(url, (error, response, body) => {
      resolve(body);
    })
  })
};


module.exports = router;
