//app.js
var Moment = require("./utils/moment.js");
var siteinfo = require("./siteinfo.js");
let iNow = 0;

App({
  onLaunch (option) {
    // 设缓存缓存起来的日期
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
  },
  onShow() {
    //适配iphonex
    wx.getSystemInfo({
      success: res =>{ 
         let modelmes = res.model;   
         if(modelmes.search('iPhone X') != -1){   
            this.globalData.isIphoneX = true   
         }   
      }
    })
  },
  userLogin() {
    // 登录
    wx.login({
      success: res1 => {
        let url = "entry/wxapp/Openids"
        if (siteinfo.uniacid==4){
          url = "entry/wxapp/Openid"
        }
        this.util.request({
          url: url,
          data: {
            code: res1.code
          },
          success:(res2) => {
            wx.getSetting({
              success:(res) => {
                if (res.authSetting["scope.userInfo"]){
                  wx.getUserInfo({
                    success:(res3) => {
                      this.util.request({
                        url: "entry/wxapp/login",
                        data: {
                          openid: res2.data.openid,
                          img: res3.userInfo.avatarUrl,
                          name: res3.userInfo.nickName
                        },
                        success:(res4) => {
                          wx.setStorage({
                            key: 'userinfo',
                            data: res4.data
                          });
                          wx.login({
                            success: res => {
                              let url = "entry/wxapp/Unionids"
                              if (siteinfo.uniacid == 4) {
                                url = "entry/wxapp/Unionid"
                              }
                              this.util.request({
                                url: url,
                                data: {
                                  iv: res3.iv,
                                  code: res.code,
                                  id: res4.data.id,
                                  openid: res4.data.openid,
                                  data: res3.encryptedData
                                },
                                success:(res) => {
                                  if (res.data && res.data.code == 0) {
                                    wx.setStorage({
                                      key: 'vipInfo',
                                      data: res.data.data
                                    });
                                  }
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  })
                }
              }
            });
          }
        });
      }
    });
  },
  getUserPhoneNumber(e, that){
    const d = e.detail;
    if(e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          wx.getStorage({
            key: 'userinfo',
            success: (res2) => {
              let url = "entry/wxapp/Jiemis"
              if (siteinfo.uniacid == 4) {
                url = "entry/wxapp/Jiemi"
              }
              this.util.request({
                url: url,
                data: {
                  iv: d.iv,
                  code: res.code,
                  data: d.encryptedData,
                  openid: res2.data.openid
                },
                success:(res3) => {
                  iNow++;
                  if (iNow == 2) {
                    that.setData({
                      isGetPhoneNumber: false
                    });
                  }
                  if (res3.data.status == 200) {
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none'
                    });
                    that.setData({
                      isGetPhoneNumber: false
                    });
                  } else {
                    wx.showToast({
                      title: res3.data.info,
                      icon: 'none'
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  },
  // 订单去支付
  goPay(id, flag) {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.util.request({
          url: "entry/wxapp/Pay",
          data: {
            flag: flag,
            order_id: id,
            openid: res.data.openid
          },
          success:(e) => {
            // 零元不走微信支付
            if (e.data.code == 1) {
              wx.showToast({
                title: '恭喜您，支付成功!',
                icon: 'none'
              });
              wx.navigateTo({
                url: '/pages/payComplete/payComplete'
              });
              return;
            }
            if (e.data.code == 0) {
              wx.showToast({
                title: e.data.msg,
                icon: 'none'
              });
            } else {
              wx.requestPayment({
                timeStamp: e.data.timeStamp,
                nonceStr: e.data.nonceStr,
                package: e.data.package,
                signType: e.data.signType,
                paySign: e.data.paySign,
                success:() => {
                  wx.showToast({
                    title: '恭喜您，支付成功!',
                    icon: 'none'
                  });
                  wx.navigateTo({
                    url: '/pages/payComplete/payComplete'
                  });
                },
                fail:() => {
                  wx.showToast({
                    title: "支付失败"
                  });
                },
                complete:() => {
                  wx.hideLoading();
                }
              });
            }
          }
        });
      }
    });
  },
  // 小写转大写
  integer(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
            newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  },
  util: require("utils/util.js"),
  globalData: {
    url: 'http://msp.showboom.cn/attachment/',
    shopCar:[],
    newArr:[],
    vipInfo: {},
    isIphonex:false,
    isMchid:false,
    imgSize: '?x-oss-process=image/resize,m_mfit,h_300,w_400'
  },
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
})