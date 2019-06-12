// pages/hotelRim/hotelRim.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  loadData() {
    // 酒店周边
    app.util.request({
      url: "entry/wxapp/Periphery",
      success:(res) => {
        const list = res.data.map(item => {
          return {
            ...item,
            img: item.img + app.globalData.imgSize,
          }
        });
        this.setData({ list });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  },
  goCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  }
})