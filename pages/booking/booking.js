// pages/booking/booking.js
const app = getApp();
var Moment = require("../../utils/moment.js");

Page({
  data: {
    start: [],
    end: [],
    days: 1,
    endWeek: '',
    startWeek: '',
    roomList: [],
    swiper: [],
    isGetPhoneNumber: false,
    isMchid: '',
    //  Tab 索引
    tabIndex: 0,
    //  是否显示房间详情
    isShowRoomDetail: false,
    //  详情滑块图片
    roomSwiper: [
      'https://static.hotel.showboom.cn/images/15/2019/06/h4i4cN5NoCN7no36WQ6whwZ6Bc4030.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
      'https://static.hotel.showboom.cn/images/15/2019/06/CF38FKqdLq8yCK18KFfKlcFqs8Q3FC.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
      'https://static.hotel.showboom.cn/images/15/2019/06/NqnPD98APe4U90900N9p0LJm84z1u0.png?x-oss-process=image/resize,m_mfit,h_300,w_400'
    ],
    //  详情滑块图片索引
    roomSwiperIndex: 0,
    //  酒店服务
    serviceList: [
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      }
    ]
  },
  //  页面显示
  onShow() {
    this.initDate();
    this.changePhoneNumber();
  },
  //  初始化数据
  initDate() {
    // 保存的日期
    wx.getStorage({
      key: 'ROOM_SOURCE_DATE',
      success: (res) => {
        const startDate = res.data.checkInDate;
        const endDate = res.data.checkOutDate;
        const start = startDate.split('-');
        const end = endDate.split('-');
        const w = new Date(startDate).getDay();
        const w2 = new Date(endDate).getDay();
        let startWeek = this.formatWeek(w);
        let endWeek = this.formatWeek(w2);
        const days = Moment(endDate).differ(startDate);
        this.setData({ days, start, end, startWeek, endWeek });
        this.loadData();
      }
    });
  },
  //  获取手机号
  getUserPhoneNumber(e){
    app.getUserPhoneNumber(e, this);
    // app.userLogin();
  },
  //  校验手机号
  changePhoneNumber() {
    wx.getStorage({
      key: 'userinfo',
      fail: (res) => {
        if(res.data.tel) {
          this.setData({
            isGetPhoneNumber: false
          });
        } else {
          this.setData({
            isGetPhoneNumber: true
          });
        }
      }
    });
  },
  //  加载数据
  loadData() {
    this.setData({
      isMchid:app.globalData.isMchid
    })
    wx.getStorage({
      key: 'system',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/RoomList",
          data: {
            start: this.data.start.join('-'),
            end: this.data.end.join('-'),
            seller_id: res.data.id
          },
          success:(res) => {
            let swiper = [];
            const roomList = res.data.map(item => {
              if (item.state == '1') {
                swiper.push(item.logo+app.globalData.imgSize);
              }
              return {
                ...item,
                logo: item.logo+app.globalData.imgSize,
                price: Math.ceil(item.min_price)
              }
            });
            this.setData({ roomList, swiper, isMchid: app.globalData.isMchid });
          }
        });
      }
    });
  },
  //  选择标签
  chooseTab: function (e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      tabIndex: index
    });
  },
  //  选择日期
  selectDate(){
    wx.navigateTo({
      url: '/pages/calendar/index'
    });
  },
  //  格式化周
  formatWeek(w) {
    if (w == 0) {
      return '周日';
    } else {
      return '周' + app.integer(w);
    }
  },
  //  查看房间详情
  toggleDetail: function () {
    this.setData({
      isShowRoomDetail: !this.data.isShowRoomDetail
    });
  },
  //  详情滑块切换
  roomSwiperChange: function (e) {
    let { current } = e.detail;
    this.setData({
      detailSwiperIndex: current
    });
  },
  //  支付
  goPay(e) {
    const room = e.currentTarget.dataset.room;
    if (!room.min_num || room.min_num == '0') {
      return;
    }
    const data = this.data;
    wx.setStorage({
      key: 'room',
      data: {
        ...room,
        startWeek: data.startWeek,
        endWeek: data.endWeek,
        days: data.days,
        start: data.start,
        end: data.end
      }
    });
    wx.navigateTo({
      url: '/pages/bookingOrder/bookingOrder'
    });
  },
  //  转发
  onShareAppMessage: function () {
  }
})