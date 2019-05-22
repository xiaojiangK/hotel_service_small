// components/goods/goods.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        this.setData({ list: newVal });
      }
    },
    isCurrentNum:{
      type: Number
    },
    isCar: {
      type: Number
    },
    isStepper: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    isStepper: false,
    isCurrentNum:false,
    isCar:false,
    totalPrice:0,
    totalCount:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      const list = allGoods.filter(item => {
        return item.goods_id != goodsId
      });
      app.globalData.newArr = list
      console.log(list)
      this.setData({
        list
      })
      let allPrice = 0
      let allNum = 0
      list.forEach(i => {
        allPrice += i.specifications[0].goods_price * i.num
        allNum += i.num
      })


      this.triggerEvent('myevent', { allPrice, allNum }, { bubbles: false });
      console.log(allPrice + '~~~~~~' + allNum)
    },
    addShopCar(e){
      let goodsItem = e.currentTarget.dataset.goods
      app.globalData.shopCar.push(goodsItem)
      console.log(app.globalData.shopCar)
      let totalCount = app.globalData.shopCar.length
      let totalPrice = 0
      app.globalData.shopCar.forEach( item => {
        totalPrice = totalPrice + Number(item.specifications[0].goods_price)
      })
      this.setData({
        totalCount,
        totalPrice
      })

      this.triggerEvent('emitData', { totalPrice: totalPrice, totalCount: totalCount }, { bubbles: false })
      console.log(totalCount + '----' + totalPrice)
    },
    /* 点击减号 */
    getCount(e){
      console.log(e.detail.value)
    },
    minus(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      console.log(allGoods)
      let cIndex = allGoods.findIndex( (c,i)=> c.goods_id == goodsId)
      console.log(cIndex)
      if (allGoods[cIndex].num>1){
        allGoods[cIndex].num--
      }
      console.log(allGoods)
      this.setData({
        list: allGoods
      })
      let allPrice = 0
      let allNum = 0
      allGoods.forEach(i => {
        allPrice+=i.specifications[0].goods_price * i.num
        allNum += i.num
      })

      this.triggerEvent('myevent', { allPrice, allNum}, { bubbles: false });
      console.log(allPrice + '~~~~~~' + allNum)
    },

    /* 点击加号 */
    add(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      console.log(allGoods)
      let cIndex = allGoods.findIndex((c, i) => c.goods_id == goodsId)
      console.log(cIndex)
      allGoods[cIndex].num++
      console.log(allGoods)
      this.setData({
        list: allGoods
      })
      let allPrice = 0
      let allNum = 0
      allGoods.forEach(i => {
        allPrice += i.specifications[0].goods_price * i.num
        allNum += i.num
      })

      this.triggerEvent('myevent', { allPrice, allNum }, { bubbles: false });
      console.log(allPrice + '~~~~~~' + allNum)
    }

  }
})
